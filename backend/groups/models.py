from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class GroupCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    icon = models.ImageField(upload_to='groups/categories/', blank=True, null=True)
    
    def __str__(self):
        return self.name

class GroupTag(models.Model):
    name = models.CharField(max_length=255, unique=True)
     
    def __str__(self):
        return self.name


class Group(models.Model):
    PUBLIC = 'public'
    PRIVATE = 'private'
    
    PRIVACY_CHOICES = [
        (PUBLIC, 'Public - Anyone can join'),
        (PRIVATE, 'Private - Requires Approval'),
    ]
    
    name = models.CharField(max_length = 255, unique=True)
    description = models.TextField(blank=True)
    creator  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_groups")
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default=PUBLIC)
    icon = models.ImageField(upload_to='groups/icons/', blank=True, null=True)
    category = models.ForeignKey(GroupCategory, on_delete=models.SET_NULL, blank=True, null=True)
    tag = models.ForeignKey(GroupTag, on_delete=models.SET_NULL, blank=True, null=True)
    max_admins = models.PositiveIntegerField(default=3, validators=[MinValueValidator(3)])
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not GroupMembership.objects.filter(group=self,user=self.creator).exists():
            GroupMembership.objects.create(
                user=self.creator,
                group=self,
                role=GroupMembership.ADMIN,
                status=GroupMembership.APPROVED
            )
    def can_add_admin(self):
        return self.groupmembership_set.filter(role=GroupMembership.ADMIN).count() < self.max_admins
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    
class GroupBadge(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='groups/badges/', blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    
class GroupMembership(models.Model):
    MEMBER = 'member'
    ADMIN = 'admin'
    MODERATOR = 'moderator'
    
    ROLE_CHOICES = [
        (MEMBER, 'Member'),
        (ADMIN, 'Admin'),
        (MODERATOR, 'Moderator'),
    ]
    
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    DECLINED = 'declined'
    
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (DECLINED, 'Declined'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=MEMBER)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    joined_at = models.DateTimeField(auto_now_add=True)
    badges = models.ManyToManyField(GroupBadge, blank=True)
    
    
    def is_member(self, user):
        return self.groupmembership_set.filter(user=user, status=GroupMembership.APPROVED).exists()

    def is_admin(self, user):
        return self.groupmemebership_set.filter(
            user=user,
            ststus = GroupMembership.APPROVED,
            role__in = [GroupMembership.ADMIN, GroupMembership.MODERATOR]
        ).exists()
        
    def get_members(self):
        return settings.AUTH_USER_MODEL.objects.filter(
            groupmembership__group=self.group,
            groupmembership__status=GroupMembership.APPROVED
        )  
    
    def get_pending_requests(self):
        return settings.AUTH_USER_MODEL.objects.filter(
            groupmembership__group=self.group,
            groupmembership__status=GroupMembership.PENDING
        )
    
    
    
    class Meta:
        unique_together = ('user', 'group')
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'group'],
                name='unique_membership'
        ),
            models.UniqueConstraint(
                fields=['group','role'],
                condition=models.Q(role='admin'),
                name = 'max_three_admins'
            )
    ]
    def __str__(self):
        return f"{self.user} in {self.group} as {self.get_role_display()}"


class GroupAnalytics(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name='analytics')
    member_count = models.PositiveIntegerField(default=0)
    post_count = models.PositiveIntegerField(default=0)
    discussions_count = models.PositiveIntegerField(default=0)
    event_count = models.PositiveIntegerField(default=0)
    daily_active_members = models.PositiveIntegerField(default=0)
    weekly_active_members = models.PositiveIntegerField(default=0)
    monthly_active_members = models.PositiveIntegerField(default=0)
    daily_post_count = models.PositiveIntegerField(default=0)
    weekly_post_count = models.PositiveIntegerField(default=0)
    monthly_post_count = models.PositiveIntegerField(default=0)
    daily_discussions_count = models.PositiveIntegerField(default=0)
    weekly_discussions_count = models.PositiveIntegerField(default=0)
    monthly_discussions_count = models.PositiveIntegerField(default=0)
    daily_event_count = models.PositiveIntegerField(default=0)
    weekly_event_count = models.PositiveIntegerField(default=0)
    monthly_event_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    def update_analytics(self):
        self.member_count = self.group.groupmembership_set.filter(status=GroupMembership.APPROVED).count()
        self.post_count = self.group.post_set.count()
        self.discussions_count = self.group.discussion_set.count()
        self.event_count = self.group.event_set.count()
        self.daily_active_members = self.group.groupmembership_set.filter(status=GroupMembership.APPROVED).count()
        self.weekly_active_members = self.group.groupmembership_set.filter(status=GroupMembership.APPROVED).count()
        self.monthly_active_members = self.group.groupmembership_set.filter(status=GroupMembership.APPROVED).count()
        self.daily_post_count = self.group.post_set.count()
        self.weekly_post_count = self.group.post_set.count()
        self.monthly_post_count = self.group.post_set.count()
        self.daily_discussions_count = self.group.discussion_set.count()
        self.weekly_discussions_count = self.group.discussion_set.count()
        self.monthly_discussions_count = self.group.discussion_set.count()
        self.daily_event_count = self.group.event_set.count()
        self.weekly_event_count = self.group.event_set.count()
        self.monthly_event_count = self.group.event_set.count()
        self.save()
    def __str__(self):
        return f"Analytics for {self.group.name}"
    
    
class GroupNotification(models.Model):
    ACTIVITY_TYPES = [
        ('post', 'New Post'),
        ('comment', 'New Comment'),
        ('discussion', 'New Discussion'),
        ('join_request', 'Join Request'),
        ('membership_change', 'Membership Change'),
        ('event', 'Event'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=25, choices=ACTIVITY_TYPES)
    activity_id = models.PositiveIntegerField()
    message = models.CharField(max_length=200)
    is_read = models.BooleanField(default=False)
    related_object_id = models.PositiveIntegerField()
    related_object_is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'group', 'activity_type', 'activity_id']
        ordering = ['-created_at']
        
    def create_notification(self, user, group, activity_type, activity_id, message, related_object_id=None):
        notification = GroupNotification(
            user=user,
            group=group,
            activity_type=activity_type,
            activity_id=activity_id,
            message=message,
            related_object_id=related_object_id
        )
        notification.save()
        
class ModerationLog(models.Model):
    ACTION_TYPES = [
        ('post_removed', 'Post Removed'),
        ('comment_removed', 'Comment Removed'),
        ('user_warned', 'User Warned'),
        ('user_banned', 'User Banned'),
    ]
    
    moderator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    target_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                                  null=True, blank=True, related_name='moderation_actions')
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_action_type_display()} by {self.moderator}"

class Ban(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    banned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                                null=True, related_name='bans_given')
    reason = models.TextField()
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'group')
    
    def is_active(self):
        if self.expires_at:
            return timezone.now() < self.expires_at
        return True
    