from rest_framework import serializers
from django.utils import timezone
from .models import (
    Group, GroupMembership, GroupCategory, GroupBadge, Badge,
    UserBadge, GroupInvite, GroupEvent, EventParticipation,
    GroupAdmin, GroupAnalytics, Notification
)
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    """
    Simplified user serializer for nested representations
    Includes basic profile information without sensitive data
    """
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'handlename', 'username', 'email', 'profile_picture']
        read_only_fields = [
            'id', 'first_name', 'last_name', 'handlename', 'username', 'profile_picture'
        ]
        extra_kwargs = {
            'email': {'write_only': True}  # Hide email in nested representations
        }

class GroupCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for group categories with icon handling
    Includes validation for unique category names
    """
    icon = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = GroupCategory
        fields = ['id', 'name', 'description', 'icon']
        read_only_fields = ['id']
    
    def validate_name(self, value):
        """
        Case-insensitive validation for unique category names
        """
        if self.instance and self.instance.name.lower() == value.lower():
            return value
        if GroupCategory.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A category with this name already exists.")
        return value

class GroupCategoryDetailSerializer(GroupCategorySerializer):
    """
    Extended category serializer with related groups
    Optimized with select_related and pagination
    """
    groups = serializers.SerializerMethodField()
    
    class Meta(GroupCategorySerializer.Meta):
        fields = GroupCategorySerializer.Meta.fields + ['groups']
    
    def get_groups(self, obj):
        from .models import Group
        groups = obj.groups.filter(
            creation_status='approved'
        ).select_related('creator', 'category')[:10]  # Optimized query
        return GroupListSerializer(
            groups, 
            many=True,
            context={'hide_details': True}  # Context control
        ).data

class BadgeSerializer(serializers.ModelSerializer):
    """
    Basic badge serializer for list views
    """
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon']
        read_only_fields = fields

class BadgeDetailSerializer(BadgeSerializer):
    """
    Detailed badge view with awarded users and group assignments
    Includes optimized queries with limits
    """
    awarded_users = serializers.SerializerMethodField()
    group_badges = serializers.SerializerMethodField()
    
    class Meta(BadgeSerializer.Meta):
        fields = BadgeSerializer.Meta.fields + ['awarded_users', 'group_badges']
    
    def get_awarded_users(self, obj):
        user_badges = obj.awarded_to.select_related(
            'user', 
            'awarded_by',
            'group_badge__group'
        )[:5]  # Limited to 5 records
        return UserBadgeSerializer(user_badges, many=True).data
    
    def get_group_badges(self, obj):
        group_badges = obj.group_badges.select_related('group')[:5]
        return GroupBadgeSerializer(group_badges, many=True).data

class GroupBadgeSerializer(serializers.ModelSerializer):
    """
    Serializer for badges assigned to groups
    Includes nested badge details and validation
    """
    badge = BadgeSerializer(read_only=True)
    group = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = GroupBadge
        fields = ['id', 'badge', 'group', 'criteria']
        read_only_fields = fields
    
    def validate(self, data):
        """
        Ensure badge isn't already assigned to the group
        """
        if self.instance:  # Skip validation on update
            return data
            
        if GroupBadge.objects.filter(
            group=data['group'], 
            badge=data['badge']
        ).exists():
            raise serializers.ValidationError(
                "This badge is already assigned to the group"
            )
        return data

class UserBadgeSerializer(serializers.ModelSerializer):
    """
    Serializer for badges awarded to users
    Includes nested user and awarder details
    """
    user = UserBasicSerializer(read_only=True)
    awarded_by = UserBasicSerializer(read_only=True)
    group_badge = GroupBadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['id', 'user', 'group_badge', 'awarded_by', 'awarded_at', 'notes']
        read_only_fields = fields
        extra_kwargs = {
            'notes': {'trim_whitespace': False}
        }

class GroupAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for group admin relationships
    Shows admin details and creation timestamp
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = GroupAdmin
        fields = ['id', 'user', 'is_creator', 'added_at']
        read_only_fields = fields

class GroupMembershipBasicSerializer(serializers.ModelSerializer):
    """
    Simplified membership serializer for nested representations
    """
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = GroupMembership
        fields = ['id', 'user', 'status', 'role', 'joined_at']
        read_only_fields = fields

class GroupMembershipDetailSerializer(GroupMembershipBasicSerializer):
    """
    Detailed membership view with group information
    """
    group = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewed_by = UserBasicSerializer(read_only=True)
    
    class Meta(GroupMembershipBasicSerializer.Meta):
        fields = GroupMembershipBasicSerializer.Meta.fields + [
            'group', 'left_at', 'leave_reason', 'reviewed_by', 'reviewed_at'
        ]

class LeaveGroupSerializer(serializers.Serializer):
    """
    Special serializer for leave group confirmation
    Includes explicit validation
    """
    confirm = serializers.BooleanField(
        required=True,
        help_text="Must be set to true to confirm leaving the group",
        error_messages={
            'required': 'You must explicitly confirm leaving',
            'invalid': 'Must be a valid boolean value'
        }
    )
    reason = serializers.CharField(
        required=False,
        max_length=255,
        allow_blank=True,
        help_text="Optional reason for leaving"
    )
    
    def validate_confirm(self, value):
        if not value:
            raise serializers.ValidationError(
                "You must confirm leaving the group"
            )
        return value

class GroupEventListSerializer(serializers.ModelSerializer):
    """
    Compact event serializer for list views
    Includes calculated status field
    """
    status = serializers.CharField(source='get_status_display', read_only=True)
    time_remaining = serializers.CharField(read_only=True)
    
    class Meta:
        model = GroupEvent
        fields = [
            'id', 'title', 'event_type', 
            'start_time', 'end_time', 
            'status', 'time_remaining'
        ]
        read_only_fields = fields

class GroupEventDetailSerializer(GroupEventListSerializer):
    """
    Complete event serializer with all details
    Optimized participant queries
    """
    group = serializers.PrimaryKeyRelatedField(read_only=True)
    creator = UserBasicSerializer(read_only=True)
    participants = serializers.SerializerMethodField()
    approval_status = serializers.CharField(source='get_approval_status_display')
    
    class Meta(GroupEventListSerializer.Meta):
        fields = GroupEventListSerializer.Meta.fields + [
            'group', 'description', 'location',
            'meeting_url', 'creator', 'participants',
            'approval_status', 'visibility', 'max_participants'
        ]
    
    def get_participants(self, obj):
        participants = obj.participations.select_related('user').filter(
            attended=True
        )[:20]  # Limit participants in response
        return UserBasicSerializer(
            [p.user for p in participants],
            many=True
        ).data

class EventParticipationSerializer(serializers.ModelSerializer):
    """
    Serializer for event attendance records
    """
    user = UserBasicSerializer(read_only=True)
    event = GroupEventListSerializer(read_only=True)
    
    class Meta:
        model = EventParticipation
        fields = ['id', 'user', 'event', 'joined_at', 'attended']
        read_only_fields = fields

class GroupListSerializer(serializers.ModelSerializer):
    """
    Compact group serializer for list views
    Includes optimized counts and URLs
    """
    category = serializers.PrimaryKeyRelatedField(
        queryset=GroupCategory.objects.all(),
        required=False,
        allow_null=True
    )
    creator = UserBasicSerializer(read_only=True)
    member_count = serializers.IntegerField(source='annotated_member_count', read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name='groups:group-detail',
        lookup_field='pk'
    )
    
    class Meta:
        model = Group
        fields = [
            'id', 'name', 'slug', 'url',
            'category', 'creator', 'group_icon',
            'privacy', 'member_count', 'created_at',
            'creation_status', 'description'
        ]
        read_only_fields = [
            'id', 'slug', 'url', 'creator', 
            'member_count', 'created_at', 'creation_status'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.category:
            representation['category'] = GroupCategorySerializer(instance.category).data
        return representation

class GroupDetailSerializer(GroupListSerializer):
    """
    Comprehensive group serializer with all relationships
    Context-aware field rendering
    """
    member_count = serializers.IntegerField(read_only=True)
    admins = GroupAdminSerializer(source='groupadmin_set', many=True, read_only=True)
    members = serializers.SerializerMethodField()
    current_user_membership = serializers.SerializerMethodField()
    badges = GroupBadgeSerializer(many=True, read_only=True)
    upcoming_events = serializers.SerializerMethodField()
    analytics = serializers.SerializerMethodField()
    
    class Meta(GroupListSerializer.Meta):
        fields = GroupListSerializer.Meta.fields + [
            'admins', 'members', 'badges', 
            'upcoming_events', 'analytics', 'current_user_membership'
        ]
        read_only_fields = [
            'admins', 'members', 'badges',
            'upcoming_events', 'analytics'
        ]

    def get_current_user_membership(self, obj):
        user = self.context['request'].user
        if user.is_anonymous:
            return None
        
        try:
            membership = GroupMembership.objects.get(group=obj, user=user)
            return GroupMembershipBasicSerializer(membership).data
        except GroupMembership.DoesNotExist:
            return None
    
    def validate_name(self, value):
        """
        Case-insensitive validation for unique group names
        """
        if Group.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A group with this name already exists.")
        return value
    
    def get_members(self, obj):
        if self.context.get('show_members'):
            members = obj.groupmembership_set.filter(
                status='approved'
            ).select_related('user')[:50]  # Limit members in response
            return GroupMembershipBasicSerializer(members, many=True).data
        return None
    
    def get_upcoming_events(self, obj):
        """
        Optimized query for upcoming approved events
        """
        events = obj.events.filter(
            start_time__gt=timezone.now(),
            approval_status='approved'
        ).select_related('created_by').order_by('start_time')[:5]
        return GroupEventListSerializer(events, many=True).data
    
    def get_analytics(self, obj):
        if self.context.get('include_analytics'):
            return GroupAnalyticsSerializer(obj.analytics).data
        return None

class GroupInviteCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new group invites
    Includes default values and validation
    """
    class Meta:
        model = GroupInvite
        fields = ['email', 'max_uses', 'expires_at', 'invite_type']
        extra_kwargs = {
            'email': {'required': False},
            'max_uses': {
                'min_value': 1,
                'default': 1,
                'help_text': 'Maximum number of uses (default 1)'
            },
            'expires_at': {
                'required': False,
                'help_text': 'Optional expiration datetime'
            },
            'invite_type': {
                'default': 'link',
                'help_text': 'Type of invite (email or link)'
            }
        }
    def create(self, validated_data):
        import secrets
        invite = GroupInvite.objects.create(
            token=secrets.token_urlsafe(32),
            uses=0,
         **validated_data
        )
        return invite

class GroupInviteDetailSerializer(serializers.ModelSerializer):
    """
    Detailed invite view with security considerations
    Excludes sensitive token field
    """
    group = GroupListSerializer(read_only=True)
    created_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = GroupInvite
        exclude = ['token']  # Security: don't expose token
        read_only_fields = ['id', 'created_at', 'uses']

class GroupAnalyticsSerializer(serializers.ModelSerializer):
    """
    Serializer for group analytics data
    Includes calculated engagement metrics
    """
    class Meta:
        model = GroupAnalytics
        fields = [
            'total_members', 'active_members',
            'new_members_7d', 'new_members_30d',
            'events_count', 'upcoming_events',
            'engagement_rate', 'last_updated'
        ]
        read_only_fields = fields

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for user notifications
    Includes related object references
    """
    group = GroupListSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'group', 'message',
            'notification_type', 'is_read',
            'created_at', 'related_object_id'
        ]
        read_only_fields = fields
    
    def mark_as_read(self, instance):
        """Helper method to mark notification as read"""
        if not instance.is_read:
            instance.is_read = True
            instance.save()