from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUseManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        if not username:
            raise ValueError(_('The Username must be set'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, username, password, **extra_fields)
    
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(_('username'),max_length=30, unique=True)
    handlename = models.CharField(_('handlename'),max_length=30, unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff status'), default=False)
    
    
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
    
    
    
    object = CustomUseManager()
    
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
        