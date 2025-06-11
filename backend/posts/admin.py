from django.contrib import admin
from .models import *
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('author', 'title', 'created_at', 'updated_at')
    search_fields = ('author__username', 'title')
    list_filter = ('created_at', 'updated_at')
    
    class Meta:
        model = Post

    def comment_count(self, obj):
        return obj.comments.count()

    comment_count.short_description = 'Comment Count'
    
    def upvotes(self, obj):
        return obj.votes.filter(vote_type='up').count()

    def downvotes(self, obj):
        return obj.votes.filter(vote_type='down').count()
    
    upvotes.short_description = 'Upvotes'
    downvotes.short_description = 'Downvotes'
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(comment_count=models.Count('comments'))
    
    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_view_permission(self, request, obj=None):
        return True

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'content', 'created_at', 'updated_at')
    search_fields = ('author__username', 'content')
    list_filter = ('created_at', 'updated_at')
    
    class Meta:
        model = Comment 
        
    def upvotes(self, obj):
        return obj.votes.filter(vote_type='up').count()

    def downvotes(self, obj):
        return obj.votes.filter(vote_type='down').count()
    
    upvotes.short_description = 'Upvotes'
    downvotes.short_description = 'Downvotes'       
    
    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ('author', 'content', 'created_at', 'updated_at')
    search_fields = ('author__username', 'content')
    list_filter = ('created_at', 'updated_at')
    
    class Meta:
        model = Reply
        
    def upvotes(self, obj):
        return obj.votes.filter(vote_type='up').count()

    def downvotes(self, obj):
        return obj.votes.filter(vote_type='down').count()
    
    upvotes.short_description = 'Upvotes'
    downvotes.short_description = 'Downvotes'       
    
    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False
@admin.register(Votes)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'comment', 'reply', 'vote_type', 'created_at', 'updated_at')
    search_fields = ('user__username', 'post__title', 'comment__content', 'reply__content')
    list_filter = ('created_at', 'updated_at')
    
    class Meta:
        model = Votes
        
    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):  
        return False  
