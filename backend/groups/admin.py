from django.contrib import admin
from .models import *

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'creator', 'privacy','member_count','created_at')
    search_fields = ('name', 'creator__username', 'creator__email')
    list_filter = ('privacy', 'created_at')
    
    def member_count(self, obj):
        return obj.groupmembership_set.filter(status='approved').count()
    member_count.short_description = 'Members'
    
@admin.register(GroupMembership)
class GroupMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'group', 'role', 'status', 'joined_at')
    list_filter = ('role', 'status', 'joined_at')
    search_fields = ('user__username', 'user__email', 'group__name')
    actions = ['approve_members', 'decline_members']
    
    def approve_members(self, request, queryset):
        queryset.update(status='approved')
    approve_members.short_description = 'Approve Selected Members'
    
    def decline_members(self, request, queryset):
        queryset.update(status='declined')
    decline_members.short_description = 'Decline Selected Members'
    
admin.site.register(GroupBadge)
admin.site.register(GroupAnalytics)
admin.site.register(GroupNotification)
