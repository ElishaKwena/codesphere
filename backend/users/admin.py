from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = UserAdmin.list_display + ('followers_count', 'following_count')
    readonly_fields = UserAdmin.readonly_fields + ('date_joined',)
    
    def followers_count(self, obj):
        return obj.followers.count()
    followers_count.short_description = 'Followers'
    
    def following_count(self,obj):
        return obj.following.count()
    following_count.short_description = 'Following'
    
@admin.register(FollowerRelationship)
class FollowerRelationshipAdmin(admin.ModelAdmin):
    list_display = ('id','follower', 'following', 'created_at')
    list_display_links = ('id', 'follower')
    list_filter = ('created_at',)
    search_fields = (
        'follower__username', 
        'follower__email',
        'following__username',
        'following__email'
        )
    raw_id_fields = ('follower', 'following')
    date_hierarchy = 'created_at'
                    
