from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from .serializers import (
    UserRegisterSerializer, UserLoginSerializer, UserSerializer, 
    FollowerRelationshipSerializer, PasswordResetRequestSerializer, 
    PasswordResetConfirmSerializer, TopicSerializer, UserInterestSerializer,
    UserInterestCreateSerializer
)
from .models import CustomUser, FollowerRelationship, Topic, UserInterest
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
import jwt
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from rest_framework import viewsets
from rest_framework.decorators import action
from django.contrib.auth import authenticate

class RegisterView(APIView):
    throttle_classes = [AnonRateThrottle]
    
    def post(self, request):
        print("RegisterView POST request received") # Debugging line
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                print(f"User {user.username} created successfully")  # Debugging line
                
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Send verification email
                verification_link = f"{settings.FRONTEND_VERIFY_URL}{uid}/{token}/"
                subject = "Verify your email address"
                message = f"Please click the link to verify your email address:\n\n {verification_link}"
                from_email = settings.DEFAULT_FROM_EMAIL
                recipient_list = [user.email]
                
                send_mail(
                    subject, 
                    message, 
                    from_email, 
                    recipient_list,
                    fail_silently=False
                )
                print(f"Verification email sent to {user.email}")  # Debugging line
                return Response(
                    {"message": "User created successfully. Please check your email to verify your account."},
                    status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        print("Serializer errors:", serializer.errors)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
class LoginView(APIView):
    throttle_classes = [AnonRateThrottle]
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data.get('email'),
                password=serializer.validated_data.get('password')
            )

            if user:
                if not user.is_active:
                    return Response({"error": "Account not verified. Please check your email for verification link",
                                     "email":user.email,
                                     "can_resend":True
                        },status=status.HTTP_403_FORBIDDEN)
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id':user.id,
                    'email':user.email,
                    'has_completed_onboarding': user.has_completed_onboarding
                })
            return Response({"error":"Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
class VerifyEmailView(APIView):
    def get(self, request, uid64, token):
        print("Login request data:", request.data)  #debugging
        try:
            uid = force_str(urlsafe_base64_decode(uid64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None
            
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                "detail": "Email verified successfully",
                "tokens":{
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                "user":{
                    'id':user.id,
                    'email':user.email,
                    'has_completed_onboarding': user.has_completed_onboarding
                },
            }, status=status.HTTP_200_OK)
            
            return Response({"detail": "Email verified successfully"}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid verification link"}, status=status.HTTP_400_BAD_REQUEST)

class ResendVerificationView(APIView):
    throttle_classes = [AnonRateThrottle]
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
            
            # Don't resend if already verified
            if user.is_active:
                return Response(
                    {"detail": "Email is already verified"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Generate new verification token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Send verification email
            verification_url = f"{settings.FRONTEND_VERIFY_URL}{uid}/{token}/"
            subject = "Verify your email address"
            message = f"Please click the following link to verify your email:\n\n{verification_url}"
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            return Response(
                {"detail": "Verification email resent successfully"},
                status=status.HTTP_200_OK
            )
            
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TopicListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        topics = Topic.objects.all()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)

class UserInterestView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        interests = request.user.interests.all()
        serializer = UserInterestSerializer(interests, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # Clear existing interests and add new ones
        request.user.interests.all().delete()
        
        topic_ids = request.data.get('topic_ids', [])
        if not topic_ids:
            return Response(
                {"error": "At least one topic must be selected"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create new interests
        interests = []
        for topic_id in topic_ids:
            try:
                topic = Topic.objects.get(id=topic_id)
                interest = UserInterest.objects.create(user=request.user, topic=topic)
                interests.append(interest)
            except Topic.DoesNotExist:
                return Response(
                    {"error": f"Topic with id {topic_id} does not exist"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Mark onboarding as completed
        request.user.has_completed_onboarding = True
        request.user.save()
        
        serializer = UserInterestSerializer(interests, many=True)
        return Response({
            "message": "Interests saved successfully",
            "interests": serializer.data,
            "has_completed_onboarding": True
        }, status=status.HTTP_201_CREATED)

class FollowerRelationshipViewSet(viewsets.ModelViewSet):
    queryset = FollowerRelationship.objects.all()
    serializer_class = FollowerRelationshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Allow filtering by follower or following
        queryset = super().get_queryset()
        follower = self.request.query_params.get('follower')
        following = self.request.query_params.get('following')
        if follower:
            queryset = queryset.filter(follower__id=follower)
        if following:
            queryset = queryset.filter(following__id=following)
        return queryset

    @action(detail=False, methods=['post'], url_path='follow', permission_classes=[IsAuthenticated])
    def follow(self, request):
        user_to_follow_id = request.data.get('user_id')
        if not user_to_follow_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_follow = CustomUser.objects.get(id=user_to_follow_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user == user_to_follow:
            return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        if FollowerRelationship.objects.filter(follower=request.user, following=user_to_follow).exists():
            return Response({"error": "You are already following this user"}, status=status.HTTP_400_BAD_REQUEST)

        FollowerRelationship.objects.create(follower=request.user, following=user_to_follow)
        return Response({"detail": f"Successfully followed {user_to_follow.username}"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='unfollow', permission_classes=[IsAuthenticated])
    def unfollow(self, request):
        user_to_unfollow_id = request.data.get('user_id')
        if not user_to_unfollow_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_unfollow = CustomUser.objects.get(id=user_to_unfollow_id)
            relationship = FollowerRelationship.objects.get(follower=request.user, following=user_to_unfollow)
            relationship.delete()
            return Response({"detail": f"Successfully unfollowed {user_to_unfollow.username}"}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except FollowerRelationship.DoesNotExist:
            return Response({"error": "You are not following this user"}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = CustomUser.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"{settings.FRONTEND_RESET_URL}{uid}/{token}/"
            subject = "Password Reset Request"
            message = f"Click the link below to reset your password:\n\n{reset_url}"
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
            return Response({"detail": "Password reset link sent to your email."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"detail": "Password reset successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "Error logging out."}, status=status.HTTP_400_BAD_REQUEST)