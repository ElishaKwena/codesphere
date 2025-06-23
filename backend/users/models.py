from django.db import models
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _



class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(_('username'),max_length=30, unique=True)
    handlename = models.CharField(_('handlename'),max_length=30, unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff status'), default=False)
    
    # Onboarding field
    has_completed_onboarding = models.BooleanField(_('completed onboarding'), default=False)
    
    profile_picture = models.ImageField(_('profile picture'), upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(_('bio'), null=True, blank=True)
    
    # user urls
    tiktok = models.URLField(_('tiktok'), null=True, blank=True)
    discord = models.URLField(_('discord'), null=True, blank=True)
    youtube = models.URLField(_('youtube'), null=True, blank=True)
    reddit = models.URLField(_('reddit'), null=True, blank=True)
    twitch = models.URLField(_('twitch'), null=True, blank=True)
    facebook = models.URLField(_('facebook'), null=True, blank=True)
    twitter = models.URLField(_('twitter'), null=True, blank=True)
    instagram = models.URLField(_('instagram'), null=True, blank=True)
    github = models.URLField(_('github'), null=True, blank=True)
    linkedin = models.URLField(_('linkedin'), null=True, blank=True)
    
    
    #  folllowers
    following = models.ManyToManyField(
        'self',
        through='FollowerRelationship',
        symmetrical=False,
        related_name='followers',
        blank=True
        )
    
    
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        
    def get_full_name(self):
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name
    def get_short_name(self):
        return self.first_name
    
    @property
    def follower_count(self):
        return self.followers.count()
    @property
    def following_count(self):
        return self.following.count()
    
    
    
class FollowerRelationship(models.Model):
    follower = models.ForeignKey(
        CustomUser, 
        related_name ='following_relationships',
        on_delete=models.CASCADE
        )
    
    following = models.ForeignKey(
        CustomUser,
        related_name='follower_relationships',
        on_delete=models.CASCADE
        )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
        
    def __str__(self):
        return f'{self.follower} follows {self.following}'
        
        
        
class Topic(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class UserInterest(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='interests')
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'topic')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.topic.name}"