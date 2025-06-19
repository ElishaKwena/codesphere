from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password

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
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'username', 'handlename', 'first_name', 'last_name',
            'date_joined', 'is_active', 'is_staff', 'profile_picture', 'bio',
            'tiktok', 'discord', 'youtube', 'reddit', 'twitch', 
            'facebook', 'twitter', 'instagram', 'github', 'linkedin','follower_count', 'following_count'
        ]
        read_only_fields = ['id', 'date_joined']

    def get_follower_count(self, obj):
        return obj.follower_count

    def get_following_count(self, obj):
        return obj.following_count

class FollowerRelationshipSerializer(serializers.ModelSerializer):
    follower = serializers.StringRelatedField(read_only=True)
    following = serializers.StringRelatedField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = FollowerRelationship
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['follower', 'created_at']
        