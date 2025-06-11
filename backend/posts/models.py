from django.db import models
from django.conf import settings
from groups.models import *



class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    title = models.CharField(max_length=255)
    # post contents
    content = models.TextField()
    post_banner = models.ImageField(upload_to='posts/banners/', blank=True, null=True)
    post_video = models.FileField(upload_to='posts/videos/', blank=True, null=True)
    
    primary_group = models.ForeignKey('groups.Group', on_delete=models.CASCADE, null=False, related_name='posts', verbose_name='primary_group')
    
    # tags
    tagged_users = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='posts_tagged')
    tagged_groups = models.ManyToManyField('groups.Group', blank=True, related_name='posts_tagged')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = ('post')
        verbose_name_plural = ('posts')
        ordering = ('-created_at',)
    def __str__(self):
        return f"{self.author.username} : {self.title[:50]}..."
    
    @property
    def comment_count(self):
        return Comment.objects.filter(post=self).count()
    
    @property
    def upvotes(self):
        return self.votes.filter(vote_type='up').count()
    
    @property
    def downvotes(self):
        return self.votes.filter(vote_type='down').count()
    
    def get_user_vote(self, user):
        if not user.is_authenticated:
            return None
        vote = self.votes.filter(user=user).first()
        return vote.vote_type if vote else None

class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name = 'comments', verbose_name ='author')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments',verbose_name='post')
    content = models.TextField()
    
    comment_banner = models.ImageField(upload_to='comments/banners/', blank=True, null=True)
    comment_video = models.FileField(upload_to='comments/videos/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = ('comment')
        verbose_name_plural = ('comments')
        ordering = ('-created_at',)
    def __str__(self):
        return f"{self.author.username} : {self.content[:50]}..."
    
    @property
    def upvotes(self):
        return self.votes.filter(vote_type='up').count()
    
    @property
    def downvotes(self):
        return self.votes.filter(vote_type='down').count()
    
    def get_user_vote(self, user):
        if not user.is_authenticated:
            return None
        vote = self.votes.filter(user=user).first()
        return vote.vote_type if vote else None
    
    @property
    def replies_count(self):
        return Reply.objects.filter(comment=self).count()
    
    
class Reply(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name = 'replies', verbose_name ='author')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='replies',verbose_name='comment')
    content = models.TextField()
    
    reply_banner = models.ImageField(upload_to='replies/banners/', blank=True, null=True)
    reply_video = models.FileField(upload_to='replies/videos/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = ('reply')
        verbose_name_plural = ('replies')
        ordering = ('-created_at',)
    def __str__(self):
        return f"{self.author.username} : {self.content[:50]}..."
    
    @property
    def upvotes(self):
        return self.votes.filter(vote_type='up').count()
    
    @property
    def downvotes(self):
        return self.votes.filter(vote_type='down').count()
    
    def get_user_vote(self, user):
        if not user.is_authenticated:
            return None
        vote = self.votes.filter(user=user).first()
        return vote.vote_type if vote else None
class Votes(models.Model):
    VOTE_CHOICES = (
        ('up', 'Up Vote'),
        ('down', 'Down Vote'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post, 
        on_delete=models.CASCADE, 
        related_name='votes', 
        verbose_name='post', 
        null=True, 
        blank=True
    )
    comment = models.ForeignKey(
        Comment, 
        on_delete=models.CASCADE, 
        related_name='votes', 
        verbose_name='comment', 
        null=True,
        blank=True
    )
    reply = models.ForeignKey(
        Reply, 
        on_delete=models.CASCADE, 
        related_name='votes', 
        verbose_name='reply', 
        null=True,
        blank=True
    )
    vote_type = models.CharField(
        max_length=4, 
        choices=VOTE_CHOICES,
        verbose_name='vote type'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'vote'
        verbose_name_plural = 'votes'
        ordering = ('-created_at',)
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'post'], 
                name='unique_user_post_vote',
                condition=models.Q(post__isnull=False)
            ),
            models.UniqueConstraint(
                fields=['user', 'comment'], 
                name='unique_user_comment_vote',
                condition=models.Q(comment__isnull=False)
            ),
            models.UniqueConstraint(
                fields=['user', 'reply'], 
                name='unique_user_reply_vote',
                condition=models.Q(reply__isnull=False)
            ),
        ]
    
    def __str__(self):
        target = self.post or self.comment or self.reply
        return f"{self.user.username} {self.vote_type}d {target}"