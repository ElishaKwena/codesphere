from django.contrib.auth import get_user_model
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.text import slugify
from django.urls import reverse
from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver
from django.db.models import Count, Q
from datetime import timedelta

User = get_user_model()

class GroupCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='group_categories/', blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Group Categories"
        ordering = ['name']

class Group(models.Model):
    PUBLIC = 'public'
    PRIVATE = 'private'
    HIDDEN = 'hidden'
    
    PRIVACY_CHOICES = [
        (PUBLIC, 'Public - Anyone can join'),
        (PRIVATE, 'Private - Requires Approval'),
        (HIDDEN, 'Hidden - Invite Only'),
    ]

    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    
    STATUS_CHOICES = [
        (PENDING, 'Pending Approval'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    ]
    
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_groups',
    )
    category = models.ForeignKey(
        GroupCategory,
        on_delete=models.SET_NULL,
        related_name='groups',
        blank=True,
        null=True
    )
    description = models.TextField(blank=True, null=True)
    group_icon = models.ImageField(upload_to='group_icons/', blank=True, null=True)
    privacy = models.CharField(
        max_length=100,
        choices=PRIVACY_CHOICES,
        default=PUBLIC
    )
    creation_status = models.CharField(
        max_length=100,
        choices=STATUS_CHOICES,
        default=PENDING
    )
    creation_reviewed_at = models.DateTimeField(blank=True, null=True)
    creation_reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='reviewed_groups'
    )
    rejection_reason = models.TextField(blank=True, null=True)
    member_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    
    admins = models.ManyToManyField(
        User,
        through='GroupAdmin',
        through_fields=('group', 'user'),
        related_name='group_admins',
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['privacy', 'creation_status']),
            models.Index(fields=['creator']),
            models.Index(fields=['slug']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def clean(self):
        if self.creation_status == self.APPROVED and not self.creation_reviewed_by:
            raise ValidationError("Approved groups must have a reviewer.")
        if self.pk and self.admin_count > 4:
            raise ValidationError("A group cannot have more than 4 admins.")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if self.creation_status == self.REJECTED and not self.creation_reviewed_at:
            self.creation_reviewed_at = timezone.now()

        self.full_clean()
        super().save(*args, **kwargs)
    
    @property
    def admin_count(self):
        return self.admins.count()
    
    @property
    def is_active(self):
        return self.creation_status == self.APPROVED
    
    def can_add_admin(self):
        return self.admin_count < 4

    def update_member_count(self):
        """
        Recalculates and updates the member count for the group.
        Uses a queryset update to avoid recursive save signals.
        """
        count = self.groupmembership_set.filter(status='approved').count()
        Group.objects.filter(pk=self.pk).update(member_count=count)

    def get_absolute_url(self):
        return reverse('group_detail', kwargs={'slug': self.slug})

@receiver(post_save, sender=Group)
def create_group_admin_and_membership(sender, instance, created, **kwargs):
    """
    When a group is created, this signal ensures that:
    1. The group's creator is automatically made a GroupAdmin.
    2. The creator is also added as the first member.
    3. If the group is hidden, a default single-use invite is created.
    """
    if created:
        # Create admin record
        GroupAdmin.objects.get_or_create(
            group=instance, 
            user=instance.creator, 
            defaults={'is_creator': True}
        )
        
        # Create membership record
        GroupMembership.objects.get_or_create(
            group=instance,
            user=instance.creator,
            defaults={
                'status': GroupMembership.APPROVED,
                'role': GroupMembership.ADMIN,
                'reviewed_by': instance.creator
            }
        )

        # If the group is hidden, create a default invite
        if instance.privacy == Group.HIDDEN:
            GroupInvite.objects.create(
                group=instance,
                created_by=instance.creator,
                expires_at=timezone.now() + timedelta(hours=24),
                max_uses=1
            )

@receiver(post_save, sender='groups.GroupAdmin')
def ensure_admin_is_member(sender, instance, created, **kwargs):
    """
    Ensures that when a user is made an admin, they are also an approved member.
    Only runs when a new admin is created, not when existing ones are updated.
    """
    if created:
        GroupMembership.objects.get_or_create(
            group=instance.group,
            user=instance.user,
            defaults={
                'status': GroupMembership.APPROVED,
                'role': GroupMembership.ADMIN,
                'reviewed_by': instance.group.creator
            }
        )

@receiver(post_delete, sender='groups.GroupAdmin')
def demote_admin_on_delete(sender, instance, **kwargs):
    if instance.user != instance.group.creator:
        try:
            membership = GroupMembership.objects.get(
                group=instance.group,
                user=instance.user
            )
            membership.role = 'member'
            membership.save()
        except GroupMembership.DoesNotExist:
            pass

@receiver(post_save, sender='groups.GroupMembership')
def update_member_count_on_save(sender, instance, **kwargs):
    instance.group.update_member_count()

@receiver(post_delete, sender='groups.GroupMembership')
def handle_membership_deletion(sender, instance, **kwargs):
    GroupAdmin.objects.filter(group=instance.group, user=instance.user).delete()
    instance.group.update_member_count()

class GroupAdmin(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_creator = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('group', 'user')
        verbose_name = 'Group Admin'
        verbose_name_plural = 'Group Admins'
        constraints = [
            models.UniqueConstraint(
                fields=['group', 'user'],
                name='unique_group_admin'
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.group.name} (Admin)"

    def clean(self):
        if self.is_creator and not self.group.creator == self.user:
            raise ValidationError("Only the group creator can be marked as is_creator.")
        
        # Only check admin count if the group is already saved in the database.
        if self.group.pk and not self.pk and self.group.admin_count >= 4:
            raise ValidationError("A group cannot have more than 4 admins.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class GroupMembership(models.Model):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    LEFT = 'left'
    
    STATUS_CHOICES = [
        (PENDING, 'Pending Approval'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
        (LEFT, 'Left Group'),
    ]
    
    MEMBER = 'member'
    MODERATOR = 'moderator'
    ADMIN = 'admin'
    
    ROLE_CHOICES = [
        (MEMBER, 'Member'),
        (MODERATOR, 'Moderator'),
        (ADMIN, 'Admin'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=PENDING)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    leave_reason = models.CharField(max_length=255, blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='reviewed_memberships'
    )
    
    class Meta:
        unique_together = ('user', 'group')
        verbose_name = 'Group Membership'
        verbose_name_plural = 'Group Memberships'
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['group', 'status']),
            models.Index(fields=['status']),
        ]
        ordering = ['-joined_at']

    def __str__(self):
        return f"{self.user.username} - {self.group.name} ({self.status})"

    def clean(self):
        if self.status == 'approved' and not self.reviewed_by:
            raise ValidationError("Approved memberships must have a reviewer.")

    def save(self, *args, **kwargs):
        if not self.pk and not self.status:
            if self.group.privacy == Group.PRIVATE:
                self.status = 'pending'
            else:
                self.status = 'approved'
        super().save(*args, **kwargs)
    
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(admins=request.user)
        return qs

    def leave_group(self, reason=""):
        """Handle member leaving with notifications"""
        if self.status == 'left':
            return False
            
        self.status = 'left'
        self.left_at = timezone.now()
        self.leave_reason = reason
        self.save()
        
        # Update group count
        self.group.update_member_count()
        
        # Remove admin privileges
        if self.user in self.group.admins.all():
            self.group.admins.remove(self.user)
        
        # Create notifications
        Notification.objects.bulk_create([
            Notification(
                user=admin,
                group=self.group,
                message=f"{self.user.username} left {self.group.name}",
                notification_type="member_left",
                related_object_id=self.id
            )
            for admin in self.group.admins.all()
        ])
        
        return True
    
    def can_rejoin(self):
        """Check if user can rejoin after leaving"""
        if self.status != 'left':
            return True
            
        if self.group.privacy == Group.PUBLIC:
            return True
            
        cooldown = timezone.timedelta(days=7)
        return timezone.now() > self.left_at + cooldown

class GroupInvite(models.Model):
    LINK = 'link'
    INVITE_TYPES = [
        ('email', 'Email Invite'),
        (LINK, 'Invite Link'),
    ]
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    token = models.CharField(max_length=32, unique=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    max_uses = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    times_used = models.PositiveIntegerField(default=0)
    invite_type = models.CharField(max_length=20, choices=INVITE_TYPES, default=LINK)
    email = models.EmailField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Group Invite'
        verbose_name_plural = 'Group Invites'
        indexes = [
            models.Index(fields=['token']),
        ]

    def __str__(self):
        return f"Invite for {self.group.name}"

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = get_random_string(32)
        super().save(*args, **kwargs)

    def is_valid(self):
        """Checks if the invite is still valid (not expired, not fully used)."""
        if self.expires_at and self.expires_at < timezone.now():
            return False
        if self.max_uses and self.times_used >= self.max_uses:
            return False
        return True

    def use_invite(self):
        """Increments the usage count for this invite."""
        if self.max_uses:
            self.times_used += 1
            self.save(update_fields=['times_used'])

    def get_absolute_url(self):
        """Returns the full URL for the frontend to handle the invite."""
        # This URL should point to your frontend application
        base_url = "http://localhost:3000" 
        return f"{base_url}/invites/accept/{self.token}/"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('member_left', 'Member Left'),
        ('new_member', 'New Member'),
        ('event_created', 'Event Created'),
        ('event_reminder', 'Event Reminder'),
        ('badge_awarded', 'Badge Awarded'),
        ('admin_action', 'Admin Action Required'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['created_at']),
        ]
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:50]}"

    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.save()

class Badge(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='badges/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Badge'
        verbose_name_plural = 'Badges'

    def __str__(self):
        return self.name

class GroupBadge(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='group_badges')
    criteria = models.TextField(help_text="Criteria for earning this badge in the group")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('group', 'badge')
        verbose_name = 'Group Badge'
        verbose_name_plural = 'Group Badges'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.badge.name} ({self.group.name})"

    def clean(self):
        """Validate badge belongs to group"""
        if self.badge.groups.filter(id=self.group.id).exists():
            raise ValidationError("This badge is already assigned to the group")

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_badges')
    group_badge = models.ForeignKey(GroupBadge, on_delete=models.CASCADE, related_name='awarded_badges')
    awarded_at = models.DateTimeField(auto_now_add=True)
    awarded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='awarded_user_badges'
    )
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ('user', 'group_badge')
        verbose_name = 'User Badge'
        verbose_name_plural = 'User Badges'
        ordering = ['-awarded_at']
        indexes = [
            models.Index(fields=['user', 'awarded_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.group_badge.badge.name}"

    def clean(self):
        """Validate user can receive this badge"""
        if not GroupMembership.objects.filter(
            user=self.user,
            group=self.group_badge.group,
            status='approved'
        ).exists():
            raise ValidationError("User must be an approved member of the group to receive this badge")

class GroupEvent(models.Model):
    ONLINE = 'online'
    IN_PERSON = 'in_person'
    HYBRID = 'hybrid'
    
    EVENT_TYPE_CHOICES = [
        (ONLINE, 'Online'),
        (IN_PERSON, 'In Person'),
        (HYBRID, 'Hybrid'),
    ]

    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    CANCELLED = 'cancelled'

    APPROVAL_STATUS_CHOICES = [
        (PENDING, 'Pending Approval'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
        (CANCELLED, 'Cancelled'),
    ]
    
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('group', 'Group Only'),
    ]
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    event_banner = models.ImageField(upload_to='event_banners/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default=ONLINE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, null=True)
    meeting_url = models.URLField(blank=True, null=True)
    max_participants = models.PositiveIntegerField(default=20, validators=[MinValueValidator(1), MaxValueValidator(1000)])
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_events'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approval_status = models.CharField(
        max_length=30,
        choices=APPROVAL_STATUS_CHOICES,
        default=PENDING
    )
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public')
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='approved_events'
    )
    approved_at = models.DateTimeField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-start_time']
        verbose_name = 'Group Event'
        verbose_name_plural = 'Group Events'
        indexes = [
            models.Index(fields=['group', 'start_time']),
            models.Index(fields=['approval_status', 'start_time']),
            models.Index(fields=['created_by', 'start_time']),
        ]

    def __str__(self):
        return f"{self.title} ({self.group.name})"

    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError("End time must be after start time.")
        if self.event_type == self.IN_PERSON and not self.location:
            raise ValidationError("Location is required for in-person events.")
        if self.event_type == self.ONLINE and not self.meeting_url:
            raise ValidationError("Meeting URL is required for online events.")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        self.full_clean()
        super().save(*args, **kwargs)
        
    @property
    def is_approved(self):
        return self.approval_status == self.APPROVED
    
    @property
    def is_pending(self):
        return self.approval_status == self.PENDING
    
    @property
    def is_rejected(self):
        return self.approval_status == self.REJECTED

    @property
    def is_cancelled(self):
        return self.approval_status == self.CANCELLED
    
    @property
    def status(self):
        now = timezone.now()
        if self.start_time <= now <= self.end_time:
            return 'ongoing'
        elif now < self.start_time:
            return 'upcoming'
        elif now > self.end_time:
            return 'completed'
        return 'scheduled'
    
    @property
    def time_remaining(self):
        from django.utils import timesince
        now = timezone.now()
        if self.status == 'ongoing':
            return f"Ends in {timesince(now, self.end_time)}"
        elif self.status == 'upcoming':
            return f"Starts in {timesince(now, self.start_time)}"
        return None
    
    @property
    def progress_percentage(self):
        now = timezone.now()
        if self.status != 'ongoing':
            return 0
        total_duration = self.end_time - self.start_time
        elapsed = now - self.start_time
        return min(100, int((elapsed.total_seconds() / total_duration.total_seconds()) * 100))
        
    def get_absolute_url(self):
        return reverse('event_detail', kwargs={'slug': self.slug})

    def approve(self, approving_user):
        if not approving_user.is_staff and not self.group.admins.filter(id=approving_user.id).exists():
            raise PermissionError("Only admins can approve events")
        self.approval_status = self.APPROVED
        self.approved_by = approving_user
        self.approved_at = timezone.now()
        self.save()
        
    def reject(self, rejecting_user, reason=""):
        if not rejecting_user.is_staff and not self.group.admins.filter(id=rejecting_user.id).exists():
            raise PermissionError("Only admins can reject events")
        self.approval_status = self.REJECTED
        self.approved_by = rejecting_user   
        self.approved_at = timezone.now()
        self.rejection_reason = reason
        self.save()   

    def cancel(self, cancelling_user, reason=""):
        if not cancelling_user.is_staff and not self.group.admins.filter(id=cancelling_user.id).exists():
            raise PermissionError("Only admins can cancel events")
        self.approval_status = self.CANCELLED
        self.approved_by = cancelling_user
        self.approved_at = timezone.now()
        self.rejection_reason = reason
        self.save()

class EventParticipation(models.Model):
    event = models.ForeignKey(GroupEvent, on_delete=models.CASCADE, related_name='participations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_participations')
    joined_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('event', 'user')
        verbose_name = 'Event Participation'
        verbose_name_plural = 'Event Participations'
        indexes = [
            models.Index(fields=['event', 'user']),
            models.Index(fields=['user', 'attended']),
        ]
        ordering = ['-joined_at']

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"

    def clean(self):
        if not GroupMembership.objects.filter(
            user=self.user,
            group=self.event.group,
            status='approved'
        ).exists():
            raise ValidationError("User must be an approved member of the group to participate")

class GroupAnalytics(models.Model):
    group = models.OneToOneField(
        Group, 
        on_delete=models.CASCADE,
        related_name='analytics'
    )
    total_members = models.PositiveIntegerField(default=0)
    active_members = models.PositiveIntegerField(default=0)
    new_members_7d = models.PositiveIntegerField(default=0)
    new_members_30d = models.PositiveIntegerField(default=0)
    events_count = models.PositiveIntegerField(default=0)
    upcoming_events = models.PositiveIntegerField(default=0)
    engagement_rate = models.FloatField(default=0.0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Group Analytics"

    def __str__(self):
        return f"Analytics for {self.group.name}"
    
    def update_analytics(self):
        """Update analytics data from group"""
        group = self.group
        
        # Member counts
        self.total_members = group.groupmembership_set.filter(status='approved').count()
        self.active_members = group.groupmembership_set.filter(
            status='approved',
            joined_at__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        # New members
        self.new_members_7d = group.groupmembership_set.filter(
            status='approved',
            joined_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        self.new_members_30d = group.groupmembership_set.filter(
            status='approved',
            joined_at__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        # Events
        self.events_count = group.events.count()
        self.upcoming_events = group.events.filter(
            start_time__gte=timezone.now(),
            approval_status='approved'
        ).count()
        
        # Engagement rate (simplified calculation)
        if self.total_members > 0:
            active_participants = EventParticipation.objects.filter(
                event__group=group,
                joined_at__gte=timezone.now() - timedelta(days=30)
            ).values('user').distinct().count()
            self.engagement_rate = (active_participants / self.total_members) * 100
        
        self.save()

class GroupView(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='viewed_by')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_views')
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('group', 'user')
        indexes = [
            models.Index(fields=['group', 'user']),
        ]
        verbose_name = 'Group View'
        verbose_name_plural = 'Group Views'

