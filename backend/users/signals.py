from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import CustomUser, FollowerRelationship

@receiver(post_save, sender=FollowerRelationship)
def update_follow_counts_on_create(sender, instance, created, **kwargs):
    if created:
        follower = instance.follower
        following = instance.following
        follower.following_count = FollowerRelationship.objects.filter(follower=follower).count()
        follower.save(update_fields=["following_count"])
        following.follower_count = FollowerRelationship.objects.filter(following=following).count()
        following.save(update_fields=["follower_count"])

@receiver(post_delete, sender=FollowerRelationship)
def update_follow_counts_on_delete(sender, instance, **kwargs):
    follower = instance.follower
    following = instance.following
    follower.following_count = FollowerRelationship.objects.filter(follower=follower).count()
    follower.save(update_fields=["following_count"])
    following.follower_count = FollowerRelationship.objects.filter(following=following).count()
    following.save(update_fields=["follower_count"]) 