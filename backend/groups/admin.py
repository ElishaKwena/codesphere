from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from django.conf import settings
from .models import (
    Group, GroupMembership, 
    GroupInvite, GroupAnalytics,
    GroupCategory, GroupAdmin, Badge, GroupBadge, UserBadge, GroupEvent, EventParticipation, Notification
)
from .tasks import update_group_analytics

@admin.register(Group)
class GroupAdminAdmin(admin.ModelAdmin):
    list_display = ('name', 'privacy_badge', 'member_count', 'admin_actions')
    list_filter = ('privacy', 'creation_status')
    search_fields = ('name', 'creator__username')
    actions = ['approve_groups', 'update_analytics']
    readonly_fields = ('creation_reviewed_at', 'creator', 'member_count')

    def save_model(self, request, obj, form, change):
        """
        Set the creator to the current user when a new group is created.
        """
        if not obj.pk:
            obj.creator = request.user
        super().save_model(request, obj, form, change)

    def privacy_badge(self, obj):
        colors = {
            'public': 'green',
            'private': 'orange',
            'hidden': 'red'
        }
        return format_html(
            '<span style="color: white; background-color: {}; padding: 3px 6px; border-radius: 4px">{}</span>',
            colors[obj.privacy],
            obj.get_privacy_display()
        )
    privacy_badge.short_description = "Privacy"

    def admin_actions(self, obj):
        return format_html(
            '<a href="/admin/groups/group/{}/change/">Edit</a> | '
            '<a href="/groups/{}/" target="_blank">View</a>',
            obj.id, obj.id
        )
    admin_actions.short_description = "Actions"

    @admin.action(description="Approve selected groups")
    def approve_groups(self, request, queryset):
        queryset.update(
            creation_status='approved',
            creation_reviewed_by=request.user,
            creation_reviewed_at=timezone.now()
        )

    @admin.action(description="Refresh analytics")
    def update_analytics(self, request, queryset):
        for group in queryset:
            if getattr(settings, 'USE_CELERY', False):
                update_group_analytics.delay(group.id)
            else:
                update_group_analytics(group.id)

@admin.register(GroupMembership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('group', 'user', 'status', 'status_badge', 'role')
    list_editable = ('status', 'role')
    list_filter = ('status', 'group__name')
    raw_id_fields = ('user',)

    def status_badge(self, obj):
        status_colors = {
            'approved': 'green',
            'pending': 'orange',
            'rejected': 'red'
        }
        return format_html(
            '<span style="color: white; background-color: {}; padding: 2px 5px; border-radius: 3px">{}</span>',
            status_colors[obj.status],
            obj.get_status_display()
        )
    status_badge.short_description = "Status"

@admin.register(GroupInvite)
class InviteAdmin(admin.ModelAdmin):
    list_display = ('group', 'created_by', 'expires_at', 'max_uses', 'times_used', 'is_valid_status', 'invite_link')
    readonly_fields = ('token', 'created_by', 'times_used')
    list_filter = ('group__name', 'created_by')
    ordering = ('-created_at',)
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set for new invites
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def is_valid_status(self, obj):
        return obj.is_valid()
    is_valid_status.boolean = True
    is_valid_status.short_description = "Is Valid"

    def invite_link(self, obj):
        url = obj.get_absolute_url()
        return format_html('<a href="{0}" target="_blank">{0}</a>', url)
    invite_link.short_description = "Invite Link"

@admin.register(GroupAnalytics)
class GroupAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('group', 'total_members', 'active_members', 'engagement_rate', 'last_updated')
    readonly_fields = ('group', 'total_members', 'active_members', 'new_members_7d', 'new_members_30d', 'events_count', 'upcoming_events', 'engagement_rate', 'last_updated')

admin.site.register(GroupCategory)
admin.site.register(GroupAdmin)
admin.site.register(Badge)
admin.site.register(GroupBadge)
admin.site.register(UserBadge)
admin.site.register(GroupEvent)
admin.site.register(EventParticipation)
admin.site.register(Notification)