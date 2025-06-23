from django.urls import path
from .views import (
    GroupListView, GroupDetailView, GroupEventListView,
    GroupApprovalView, JoinGroupView, GroupCategoryListView,
    GroupCategoryDetailView, BadgeDetailView, BadgeListView,
    GroupBadgeListView, GroupBadgeCreateView, AwardBadgeView,
    GroupInviteCreateView, GroupInviteListView, AcceptInviteView,
    GroupAnalyticsView,
    EventAnalyticsView, MemberActivityView, LeaveGroupView,EventParticipationListCreateAPIView, EventParticipationDetailAPIView,
    UserGroupsView,
)

app_name = 'groups'

urlpatterns = [
    # ==================== Categories ====================
    path('categories/', 
         GroupCategoryListView.as_view(), 
         name='category-list'),
    path('categories/<int:pk>/', 
         GroupCategoryDetailView.as_view(), 
         name='category-detail'),

    # ==================== Badges ====================
    path('badges/', 
         BadgeListView.as_view(), 
         name='badge-list'),
    path('badges/<int:pk>/', 
         BadgeDetailView.as_view(), 
         name='badge-detail'),

    # ==================== Groups ====================
    path('groups/', 
         GroupListView.as_view(), 
         name='group-list'),
    path('groups/<int:pk>/', 
         GroupDetailView.as_view(), 
         name='group-detail'),
    path('groups/<int:group_id>/join/', 
         JoinGroupView.as_view(), 
         name='join-group'),
    path('groups/<int:group_id>/leave/', 
         LeaveGroupView.as_view(), 
         name='leave-group'),

    # ==================== Group Badges ====================
    path('groups/<int:group_id>/badges/', 
         GroupBadgeListView.as_view(), 
         name='group-badge-list'),
    path('groups/<int:group_id>/badges/create/', 
         GroupBadgeCreateView.as_view(), 
         name='group-badge-create'),
    path('groups/<int:group_id>/badges/<int:badge_id>/award/', 
         AwardBadgeView.as_view(), 
         name='award-badge'),

    # ==================== Group Invites ====================
    path('groups/<int:group_id>/invites/', 
         GroupInviteListView.as_view(), 
         name='group-invite-list'),
    path('groups/<int:group_id>/invites/create/', 
         GroupInviteCreateView.as_view(), 
         name='group-invite-create'),
    path('groups/<int:group_id>/join-with-invite/', 
         JoinGroupView.as_view(), 
         name='join-with-invite'),
    path('invites/accept/<str:token>/', 
         AcceptInviteView.as_view(), 
         name='accept-invite'),

    # ==================== Group Events ====================
    path('groups/<int:group_id>/events/', 
         GroupEventListView.as_view(), 
         name='group-event-list'),
    
     path('groups/<int:group_id>/events/<int:event_id>/participations/',
         EventParticipationListCreateAPIView.as_view(),
         name='event-participation-list'),
         
    path('participations/<int:participation_id>/',
         EventParticipationDetailAPIView.as_view(),
         name='event-participation-detail'),

    # ==================== Analytics ====================
    path('groups/<int:group_id>/analytics/', 
         GroupAnalyticsView.as_view(), 
         name='group-analytics'),
    path('groups/<int:group_id>/analytics/members/', 
         MemberActivityView.as_view(), 
         name='member-activity'),
    path('groups/<int:group_id>/analytics/events/', 
         EventAnalyticsView.as_view(), 
         name='event-analytics'),

    # ==================== Admin Endpoints ====================
    path('admin/groups/pending/', 
         GroupApprovalView.as_view(), 
         name='pending-group-list'),
    path('admin/groups/<int:group_id>/approve/', 
         GroupApprovalView.as_view(), 
         name='approve-group'),

    # User's groups - moved to end to avoid conflicts
    path('user-groups/', UserGroupsView.as_view(), name='user-groups'),
]