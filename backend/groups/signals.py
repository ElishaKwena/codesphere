# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *
from django.db import transaction
from django.db.models.signals import post_save, post_delete, m2m_changed

@receiver(post_save, sender=Group)
def add_creator_as_admin(sender, instance, created, **kwargs):
    if created:
        GroupMembership.objects.create(
            user=instance.creator,
            group=instance,
            role=GroupMembership.ADMIN,
            status=GroupMembership.APPROVED
        )
@receiver(post_save, sender=Group)
def create_group_analytics(sender, instance, created, **kwargs):
    if created:
        GroupAnalytics.objects.create(group=instance)

@receiver(post_save,)
def notify_new_post(sender, instance, created, **kwargs):
    if created:
        from .models import GroupNotification
        for membership in instance.group.groupmembership_set.filter(status='approved'):
            GroupNotification.create_notification(
                user=membership.user,
                group=instance.group,
                activity_type='post',
                message=f"New post in {instance.group.name}",
                obj=instance
            )

@receiver(post_save, sender=GroupMembership)
def notify_membership_change(sender, instance, created, **kwargs):
    if not created and instance.status == 'approved':
        GroupNotification.create_notification(
            user=instance.user,
            group=instance.group,
            activity_type='membership_change',
            message=f"You are now a member of {instance.group.name}",
            obj=instance
        )

@receiver(m2m_changed, sender=Group.tags.through)
def update_tags_analytics(sender, instance, action, **kwargs):
    if action in ['post_add', 'post_remove']:
        instance.analytics.update_analytics()