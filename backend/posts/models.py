from django.db import models
from django.contrib.auth import get_user_model
from groups.models import Group

User = get_user_model

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    
    
class Reply(models.Model):
    pass
class Post(models.Model):
    # ===================choices =============================
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    # ================== Author Details ======================
    author = models.ForeignKey(User, on_delete = models.CASCADE, on_delete = models.CASCADE)
    
    
    # ================== Post Details ======================
    title = models.CharField(max_length=255)
    content = models.TextField()
    thumbnail = models.ImageField(upload_to = 'posts/postBanners/', blank=True, null=True)
    video_file = models.FileField(upload_to='posts/videos/', blank=True, null=True) 
    
    primary_group= models.ForeignKey(Group, on_delete=models.CASCADE, null=False)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default = 'pending')
    
    reviewed_by = models.ForeignKey(User,on_delete=models.SET_NULL)
    rejection_reason = models.TextField(blank=True, null=True)
    
    # ================== Tags Details ======================
    tagged_group = models.ManyToManyField(Group, null=True)
    tagged_users = models.ManyToManyField(User, null=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField()
    
    class Meta:
        verbose_name = ('post')
        verbose_name_plural = ('posts')
        ordering = ('-created_at',)
    def __str__(self):
        return f"{self.author.username} : {self.title[:50]}..."
    
class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    thumbnail = models.ImageField(upload_to = 'comments/commentThumbnail/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = ('comment')
        verbose_name_plural = ('comments')
        ordering = ('-created_at',)
    def __str__(self):
        return f"{self.author.username} : {self.content[:50]}..."
    
class Vote(models.Model):
    pass