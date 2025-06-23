from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str, force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name', 'description',]

class UserInterestSerializer(serializers.ModelSerializer):
    topic = TopicSerializer(read_only=True)
    
    class Meta:
        model = UserInterest
        fields = ['id', 'topic', 'created_at']

class UserInterestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInterest
        fields = ['topic']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'password2', 'handlename', 'first_name', 'last_name',]
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'handlename': {'required': True},
        }
    
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password":"Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            handlename=validated_data['handlename'],password=validated_data['password'],
            is_active=False,  # User is inactive by default
        )
        return user
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'password']
        
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials")
            if not user.is_active:
                raise serializers.ValidationError("User account is inactive")
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError("Email and Password are required")

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    interests = UserInterestSerializer(many=True, read_only=True)
    is_following = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'username', 'handlename', 'first_name', 'last_name',
            'date_joined', 'is_active', 'is_staff', 'profile_picture', 'bio',
            'tiktok', 'discord', 'youtube', 'reddit', 'twitch', 
            'facebook', 'twitter', 'instagram', 'github', 'linkedin',
            'follower_count', 'following_count', 'has_completed_onboarding', 'interests',
            'is_following'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_follower_count(self, obj):
        return obj.follower_count

    def get_following_count(self, obj):
        return obj.following_count

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FollowerRelationship.objects.filter(follower=request.user, following=obj).exists()
        return False

class FollowerRelationshipSerializer(serializers.ModelSerializer):
    follower = serializers.StringRelatedField(read_only=True)
    following = serializers.StringRelatedField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = FollowerRelationship
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['follower', 'created_at']

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uid']))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid UID."})
        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({"token": "Invalid or expired token."})
        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
        