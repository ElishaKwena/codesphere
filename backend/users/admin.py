from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from .models import *
from django.core.exceptions import ValidationError

class UserInterestInline(admin.TabularInline):
    model = UserInterest
    extra = 0
    readonly_fields = ('created_at',)
    autocomplete_fields = ['topic']

# Custom forms for user creation and change
class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'handlename', 'first_name', 'last_name')

    def clean_handlename(self):
        handlename = self.cleaned_data.get('handlename')
        if not handlename:
            raise ValidationError('Handlename is required.')
        if CustomUser.objects.filter(handlename=handlename).exists():
            raise ValidationError('A user with that handlename already exists.')
        return handlename

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class CustomUserChangeForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'handlename', 'first_name', 'last_name', 'is_active', 'is_staff')

    def clean_handlename(self):
        handlename = self.cleaned_data.get('handlename')
        if not handlename:
            raise ValidationError('Handlename is required.')
        qs = CustomUser.objects.filter(handlename=handlename)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise ValidationError('A user with that handlename already exists.')
        return handlename

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email', 'username', 'handlename', 'first_name', 'is_staff', 'topics_list')
    readonly_fields = getattr(UserAdmin, 'readonly_fields', tuple()) + ('date_joined',)
    inlines = [UserInterestInline]

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'handlename', 'first_name', 'last_name', 'profile_picture', 'bio')}),
        ('Social', {'fields': ('tiktok', 'discord', 'youtube', 'reddit', 'twitch', 'facebook', 'twitter', 'instagram', 'github', 'linkedin')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'handlename', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

    def followers_count(self, obj):
        return obj.followers.count()
    followers_count.short_description = 'Followers'
    
    def following_count(self,obj):
        return obj.following.count()
    following_count.short_description = 'Following'

    def topics_list(self, obj):
        return ", ".join([interest.topic.name for interest in obj.interests.all()])
    topics_list.short_description = "Topics"

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(UserInterest)
class UserInterestAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'user_handlename', 'topic_name', 'created_at')
    list_filter = ('topic', 'created_at')
    search_fields = ('user__email', 'user__username', 'user__handlename', 'topic__name')
    date_hierarchy = 'created_at'
    raw_id_fields = ('user', 'topic')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'

    def user_handlename(self, obj):
        return obj.user.handlename
    user_handlename.short_description = 'Handlename'

    def topic_name(self, obj):
        return obj.topic.name
    topic_name.short_description = 'Topic'

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
                    
