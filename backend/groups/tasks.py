from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags
from django.conf import settings
from .models import Group, GroupMembership, Notification
import logging

logger = logging.getLogger(__name__)

# Conditional Celery import
if getattr(settings, 'USE_CELERY', False):
    from celery import shared_task
else:
    # Fallback decorator for when Celery is disabled
    def shared_task(func=None, **kwargs):
        def decorator(f):
            return f
        if func:
            return decorator(func)
        return decorator

@shared_task(bind=True, max_retries=3, soft_time_limit=30)
def send_group_notification(self, notification_data):
    """
    Async task for sending group notifications with retry logic.
    Handles both emails and in-app notifications.
    """
    try:
        # Create in-app notification
        Notification.objects.create(
            user_id=notification_data['user_id'],
            group_id=notification_data.get('group_id'),
            message=notification_data['message'],
            notification_type=notification_data.get('type', 'info')
        )

        # Send email if configured
        if notification_data.get('send_email'):
            user_email = notification_data['email']
            subject = f"Group Update: {notification_data['group_name']}"
            html_message = render_to_string(
                'groups/notification_email.html',
                {'message': notification_data['message']}
            )
            send_mail(
                subject,
                strip_tags(html_message),
                'noreply@yourdomain.com',
                [user_email],
                html_message=html_message,
                fail_silently=False
            )

    except Exception as e:
        logger.error(f"Notification failed: {e}")
        if hasattr(self, 'retry'):
            try:
                self.retry(countdown=2 ** self.request.retries * 60)
            except Exception as retry_error:
                logger.critical(f"Permanent failure on notification {notification_data}: {retry_error}")
        else:
            logger.critical(f"Notification failed permanently: {notification_data}")

@shared_task
def update_group_analytics(group_id):
    """Periodic task to refresh group analytics"""
    from .models import GroupAnalytics
    analytics, _ = GroupAnalytics.objects.get_or_create(group_id=group_id)
    analytics.update_analytics()
    return f"Updated analytics for group {group_id}"

@shared_task
def expire_invites():
    """Clean up expired group invites"""
    from .models import GroupInvite
    expired = GroupInvite.objects.filter(
        expires_at__lte=timezone.now()
    ).delete()
    return f"Deleted {expired[0]} expired invites"

@shared_task
def log_invite_creation(invite_id):
    """Log invite creation for analytics"""
    from .models import GroupInvite
    try:
        invite = GroupInvite.objects.get(id=invite_id)
        logger.info(f"Invite created: {invite.id} for group {invite.group.name}")
    except GroupInvite.DoesNotExist:
        logger.warning(f"Invite {invite_id} not found for logging")
    return f"Logged invite creation for {invite_id}"