import logging
from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver
from django.db import transaction
from django.core.cache import cache
from django.conf import settings
from .models import (
    Group, GroupMembership, GroupAdmin,
    GroupEvent, GroupAnalytics, Notification,
    UserBadge, GroupInvite, EventParticipation
)
from django.contrib.auth import get_user_model
from django.utils import timezone

logger = logging.getLogger(__name__)
User = get_user_model()

# ==================== CELERY TASKS IMPLEMENTATION ====================
if settings.USE_CELERY:
    from celery import shared_task

    @shared_task(bind=True, max_retries=3)
    def async_send_notifications(self, notification_data):
        """
        Handles bulk notification creation in background
        with retry logic for failed attempts
        """
        try:
            notifications = [
                Notification(**data) for data in notification_data
            ]
            Notification.objects.bulk_create(notifications)
        except Exception as e:
            logger.error(f"Notification task failed: {e}")
            self.retry(countdown=60 * pow(2, self.request.retries))

    @shared_task
    def schedule_event_reminders(event_id):
        """Async task for scheduling event reminders"""
        try:
            event = GroupEvent.objects.get(id=event_id)
            if event.approval_status == 'approved':
                # Implement your reminder logic here
                # Example: Send emails 24h before event
                pass
        except GroupEvent.DoesNotExist:
            logger.warning(f"Event {event_id} not found for reminders")

    @shared_task
    def update_member_count(group_id):
        """Celery task for atomic member count updates"""
        group = Group.objects.get(id=group_id)
        with transaction.atomic():
            group.member_count = GroupMembership.objects.filter(
                group=group, 
                status='approved'
            ).count()
            group.save()

# ==================== SIGNAL DISABLING UTILITY ====================
class DisableSignals:
    """
    Context manager to temporarily disable signals
    Usage:
    with DisableSignals():
        # Bulk operations without signal triggers
    """
    def __init__(self):
        self.stashed_signals = {
            'post_save': post_save.receivers,
            'post_delete': post_delete.receivers,
            'm2m_changed': m2m_changed.receivers
        }

    def __enter__(self):
        post_save.receivers = []
        post_delete.receivers = []
        m2m_changed.receivers = []

    def __exit__(self, exc_type, exc_val, exc_tb):
        post_save.receivers = self.stashed_signals['post_save']
        post_delete.receivers = self.stashed_signals['post_delete']
        m2m_changed.receivers = self.stashed_signals['m2m_changed']

# ==================== GROUP SIGNALS ====================
@receiver(post_save, sender=Group)
def handle_group_save(sender, instance, created, **kwargs):
    if created:
        with DisableSignals():  # Prevent recursive signals
            GroupAnalytics.objects.create(group=instance)
        
        cache.delete_pattern('group_list_*')  # Clear all paginated caches

    if 'privacy' in kwargs.get('update_fields', []):
        cache.delete(f'group_{instance.id}_member_count')

# ==================== MEMBERSHIP SIGNALS ====================
@receiver(post_save, sender=GroupMembership)
def handle_membership_change(sender, instance, created, **kwargs):
    if instance.status == 'approved':
        if settings.USE_CELERY:
            # Process in background if Celery enabled
            update_member_count.delay(instance.group_id)
            
            if created:
                async_send_notifications.delay([{
                    'user_id': instance.user_id,
                    'group_id': instance.group_id,
                    'message': f"Welcome to {instance.group.name}!",
                    'notification_type': "welcome"
                }])
        else:
            # Synchronous fallback
            with transaction.atomic():
                instance.group.member_count = GroupMembership.objects.filter(
                    group=instance.group, 
                    status='approved'
                ).count()
                instance.group.save()
            
            if created:
                Notification.objects.create(
                    user=instance.user,
                    group=instance.group,
                    message=f"Welcome to {instance.group.name}!",
                    notification_type="welcome"
                )

# ==================== EVENT SIGNALS ====================
@receiver(post_save, sender=GroupEvent)
def handle_event_approval(sender, instance, **kwargs):
    if 'approval_status' in kwargs.get('update_fields', []):
        if instance.approval_status == 'approved':
            if settings.USE_CELERY:
                schedule_event_reminders.delay(instance.id)
                
                # Batch notify all group members
                members = GroupMembership.objects.filter(
                    group=instance.group,
                    status='approved'
                ).select_related('user')
                
                notification_data = [{
                    'user_id': member.user_id,
                    'group_id': instance.group_id,
                    'message': f"New event: {instance.title}",
                    'notification_type': "event_announcement"
                } for member in members]
                
                async_send_notifications.delay(notification_data)

# ==================== BULK OPERATION EXAMPLE ====================
def bulk_create_groups(groups_data):
    """Example usage of signal disabling"""
    with DisableSignals(), transaction.atomic():
        groups = Group.objects.bulk_create([
            Group(**data) for data in groups_data
        ])
        
        # Manually create analytics for performance
        GroupAnalytics.objects.bulk_create([
            GroupAnalytics(group=group) for group in groups
        ])
    
    # Now signals are re-enabled
    cache.delete('group_list_cache')
    return groups

@receiver(post_save, sender=EventParticipation)
def notify_event_organizers(sender, instance, created, **kwargs):
    if created:
        # Define the send_notification task if not already defined
        if settings.USE_CELERY:
            from celery import shared_task

            @shared_task
            def send_notification(user_id, message):
                Notification.objects.create(
                    user_id=user_id,
                    message=message,
                    notification_type="event_participation"
                )

            send_notification.delay(
                user_id=instance.event.creator_id,
                message=f"{instance.user.username} joined your event"
            )
        else:
            Notification.objects.create(
                user_id=instance.event.creator_id,
                message=f"{instance.user.username} joined your event",
                notification_type="event_participation"
            )