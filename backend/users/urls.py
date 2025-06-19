from django.urls import path
from .views import (
    RegisterView, UserDetailView, LoginView, LogoutView, VerifyEmailView, ResendVerificationView,
    FollowerRelationshipViewSet, PasswordResetRequestView, PasswordResetConfirmView
)

fr_list = FollowerRelationshipViewSet.as_view({'get': 'list', 'post': 'create'})
fr_detail = FollowerRelationshipViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})
fr_follow = FollowerRelationshipViewSet.as_view({'post': 'follow'})
fr_unfollow = FollowerRelationshipViewSet.as_view({'post': 'unfollow'})

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify-email/<str:uid64>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verification/', ResendVerificationView.as_view(), name='resend-verification'),
    path('follow/', fr_list, name='follow-list'),
    path('follow/<int:pk>/', fr_detail, name='follow-detail'),
    path('follow/follow/', fr_follow, name='follow-follow'),
    path('follow/unfollow/', fr_unfollow, name='follow-unfollow'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
