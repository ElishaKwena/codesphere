from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.crypto import get_random_string
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch, Count, F, Q
from rest_framework.pagination import PageNumberPagination
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.throttling import ScopedRateThrottle, UserRateThrottle
from .models import (
    Group, GroupMembership, GroupEvent, GroupAdmin,
    EventParticipation, GroupCategory, Badge,
    UserBadge, GroupBadge, GroupInvite, GroupAnalytics, Notification, GroupView
)
from .permissions import IsEventParticipant, IsGroupAdmin, IsEventParticipantOrAdmin
from .serializers import (
    GroupListSerializer, GroupDetailSerializer,
    GroupEventListSerializer, GroupEventDetailSerializer,
    GroupCategoryDetailSerializer,
    GroupCategorySerializer, BadgeSerializer, BadgeDetailSerializer,
    UserBadgeSerializer, GroupBadgeSerializer, GroupInviteDetailSerializer,
    GroupInviteCreateSerializer, GroupMembershipBasicSerializer,
    GroupAnalyticsSerializer, LeaveGroupSerializer,EventParticipationSerializer
)

User = get_user_model()

# ==================== Throttle Classes ====================
class GroupCreateThrottle(ScopedRateThrottle):
    scope = 'group-create'

class GroupJoinThrottle(ScopedRateThrottle):
    scope = 'group-join'

class ParticipationThrottle(UserRateThrottle):
    rate = '10/hour'
    
class GroupInviteThrottle(ScopedRateThrottle):
    scope = 'group-invite'

class AdminActionThrottle(ScopedRateThrottle):
    scope = 'group-admin-action'

class AnalyticsThrottle(ScopedRateThrottle):
    scope = 'analytics'

class CustomPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

# ==================== Group Categories ====================
class GroupCategoryListView(APIView):
    permission_classes = []  # Allow unauthenticated access for viewing
    pagination_class = CustomPagination

    def get(self, request):
        categories = GroupCategory.objects.all().order_by('name')
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(categories, request)
        serializer = GroupCategorySerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        # Require authentication for creating categories
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required to create categories'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admin users can create categories'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = GroupCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GroupCategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(
            GroupCategory.objects.prefetch_related(
                Prefetch('groups', queryset=Group.objects.filter(creation_status='approved'))
            ),
            pk=pk
        )

    def get(self, request, pk):
        category = self.get_object(pk)
        serializer = GroupCategoryDetailSerializer(category)
        return Response(serializer.data)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admin users can delete categories'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        category = self.get_object(pk)
        if category.groups.exists():
            return Response(
                {'error': 'Cannot delete category with active groups'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ==================== Badges ====================
class BadgeListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get(self, request):
        badges = Badge.objects.all().order_by('name')
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(badges, request)
        serializer = BadgeSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

class BadgeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(
            Badge.objects.prefetch_related(
                'awarded_to__user',
                'awarded_to__awarded_by',
                'group_badges__group'
            ),
            pk=pk
        )

    def get(self, request, pk):
        badge = self.get_object(pk)
        serializer = BadgeDetailSerializer(badge)
        return Response(serializer.data)

# ==================== Group Badges ====================
class GroupBadgeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        badges = group.badges.select_related('badge').all()
        serializer = GroupBadgeSerializer(badges, many=True)
        return Response(serializer.data)

class GroupBadgeCreateView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AdminActionThrottle]

    def post(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        
        if not group.admins.filter(id=request.user.id).exists():
            return Response(
                {'error': 'Only group admins can create badges'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        badge_id = request.data.get('badge_id')
        if not badge_id:
            return Response(
                {'error': 'badge_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        badge = get_object_or_404(Badge, pk=badge_id)
        
        if GroupBadge.objects.filter(group=group, badge=badge).exists():
            return Response(
                {'error': 'Badge already exists for this group'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        group_badge = GroupBadge.objects.create(
            group=group,
            badge=badge,
            criteria=request.data.get('criteria', '')
        )
        
        serializer = GroupBadgeSerializer(group_badge)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AwardBadgeView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AdminActionThrottle]

    def post(self, request, group_id, badge_id):
        group = get_object_or_404(Group, pk=group_id)
        group_badge = get_object_or_404(GroupBadge, group=group, badge_id=badge_id)
        
        if not group.admins.filter(id=request.user.id).exists():
            return Response(
                {'error': 'Only group admins can award badges'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, pk=user_id)
        
        if not GroupMembership.objects.filter(user=user, group=group, status='approved').exists():
            return Response(
                {'error': 'User is not an approved member'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if UserBadge.objects.filter(user=user, group_badge=group_badge).exists():
            return Response(
                {'error': 'User already has this badge'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_badge = UserBadge.objects.create(
            user=user,
            group_badge=group_badge,
            awarded_by=request.user,
            notes=request.data.get('notes', '')
        )
        
        serializer = UserBadgeSerializer(user_badge)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# ==================== Groups ====================
class GroupListView(APIView):
    permission_classes = []  # Allow unauthenticated access for viewing
    pagination_class = CustomPagination
    throttle_classes = [GroupCreateThrottle]

    def get(self, request):
        groups = Group.objects.select_related('creator').prefetch_related('category').filter(
            creation_status='approved'
        ).annotate(
            annotated_member_count=Count('groupmembership', distinct=True)
        ).order_by('-created_at', '-annotated_member_count')
        
        # Search functionality
        search_query = request.query_params.get('search')
        if search_query:
            groups = groups.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(category__name__icontains=search_query)
            )
        
        # Filtering logic
        category_id = request.query_params.get('category')
        if category_id:
            groups = groups.filter(category__id=category_id)
            
        exclude_id = request.query_params.get('exclude')
        if exclude_id:
            groups = groups.exclude(id=exclude_id)
            
        # Add more filters as needed...
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(groups, request)
        serializer = GroupListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        # Require authentication for creating groups
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required to create groups'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = GroupDetailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            group = serializer.save(creator=request.user)
            # Group is automatically created with creation_status='pending' (default)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GroupDetailView(APIView):
    permission_classes = []  # Allow unauthenticated access for viewing

    def get_object(self, pk):
        return get_object_or_404(
            Group.objects.select_related('category', 'creator', 'creation_reviewed_by').prefetch_related(
                Prefetch('groupadmin_set', queryset=GroupAdmin.objects.select_related('user')),
                Prefetch('groupmembership_set', queryset=GroupMembership.objects.select_related('user'))
            ),
            pk=pk
        )

    def get(self, request, pk):
        group = self.get_object(pk)

        # Track unique view if user is authenticated
        if request.user.is_authenticated:
            _, created = GroupView.objects.get_or_create(
                group=group,
                user=request.user
            )
            if created:
                # Atomically update the view count
                Group.objects.filter(pk=group.pk).update(views_count=F('views_count') + 1)
                group.refresh_from_db()

        context = {
            'request': request,
            'show_members': True,
            'is_admin': request.user.is_authenticated and hasattr(request.user, 'is_authenticated') and request.user in group.admins.all()
        }
        serializer = GroupDetailSerializer(group, context=context)
        return Response(serializer.data)

    def put(self, request, pk):
        # Require authentication for updating groups
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required to update groups'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        group = self.get_object(pk)
        if request.user not in group.admins.all():
            return Response(
                {"detail": "Only group admins can update the group."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = GroupDetailSerializer(
            group, 
            data=request.data, 
            partial=True, 
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        # Require authentication for deleting groups
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required to delete groups'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        group = self.get_object(pk)

        # Check if user is the creator
        if group.creator != request.user:
            return Response(
                {'error': 'You do not have permission to delete this group.'},
                status=status.HTTP_403_FORBIDDEN
            )

        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ==================== Group Events ====================
class GroupEventListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    throttle_classes = [AdminActionThrottle]

    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        events = GroupEvent.objects.filter(group=group).order_by('-start_time')
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(events, request)
        
        serializer = GroupEventListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        
        # Check if the user is a group admin
        if not group.admins.filter(id=request.user.id).exists():
            return Response(
                {'error': 'Only group admins can create events.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = GroupEventDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(group=group)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ==================== Event Participation ====================
class EventParticipationListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ParticipationThrottle]

    def get(self, request, group_id, event_id):
        # Ensure the event belongs to the group
        event = get_object_or_404(GroupEvent, pk=event_id, group_id=group_id)
        
        # Fetch all participations for the event
        participations = EventParticipation.objects.filter(event=event).select_related('user')
        
        serializer = EventParticipationSerializer(participations, many=True)
        return Response(serializer.data)

    def post(self, request, group_id, event_id):
        event = get_object_or_404(GroupEvent, pk=event_id, group_id=group_id)

        # Check if user is already registered
        if EventParticipation.objects.filter(event=event, user=request.user).exists():
            return Response(
                {'error': 'You are already registered for this event.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create participation
        participation = EventParticipation.objects.create(event=event, user=request.user)
        serializer = EventParticipationSerializer(participation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class EventParticipationDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsEventParticipantOrAdmin]

    def get_object(self, participation_id):
        """
        Helper method to get the participation object and check permissions.
        """
        obj = get_object_or_404(EventParticipation, pk=participation_id)
        self.check_object_permissions(self.request, obj)
        return obj

    def get(self, request, participation_id):
        participation = self.get_object(participation_id)
        serializer = EventParticipationSerializer(participation)
        return Response(serializer.data)

    def patch(self, request, participation_id):
        participation = self.get_object(participation_id)
        
        # Allow updating fields like 'status' (e.g., checked-in)
        serializer = EventParticipationSerializer(participation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, participation_id):
        participation = self.get_object(participation_id)
        participation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# ==================== Admin Endpoints ====================
class GroupApprovalView(APIView):
    permission_classes = [IsAdminUser]
    throttle_classes = [AdminActionThrottle]

    def get(self, request):
        # List all groups awaiting approval
        pending_groups = Group.objects.filter(creation_status='pending').order_by('created_at')
        serializer = GroupListSerializer(pending_groups, many=True)
        return Response(serializer.data)

    def post(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        
        # Check if the group is actually pending
        if group.creation_status != 'pending':
            return Response(
                {'error': 'Group is not pending approval.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Approve the group
        group.creation_status = 'approved'
        group.save()
        
        # Notify the creator
        Notification.objects.create(
            user=group.creator,
            group=group,
            message=f'Your group "{group.name}" has been approved and is now public.'
        )
        
        return Response(
            {'message': 'Group approved successfully.'},
            status=status.HTTP_200_OK
        )

# ==================== Group Actions ====================
class JoinGroupView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [GroupJoinThrottle]

    def post(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)

        # Check if user is already a member
        if GroupMembership.objects.filter(user=request.user, group=group).exists():
            return Response(
                {'error': 'You are already a member of this group.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle joining logic based on group privacy
        if group.privacy == 'public':
            GroupMembership.objects.create(
                user=request.user,
                group=group,
                role='member',
                status='approved'
            )
            # Create a notification
            Notification.objects.create(
                user=request.user,
                group=group,
                message=f'You have successfully joined the group "{group.name}".'
            )
            return Response(
                {'message': 'Successfully joined the group.'},
                status=status.HTTP_200_OK
            )
        
        elif group.privacy == 'private':
            GroupMembership.objects.create(
                user=request.user,
                group=group,
                role='member',
                status='pending'
            )
            # Notify admins of the join request
            admins = group.admins.all()
            for admin in admins:
                Notification.objects.create(
                    user=admin,
                    group=group,
                    message=f'A new user, {request.user.username}, has requested to join your group "{group.name}".'
                )
            return Response(
                {'message': 'Your request to join has been sent for approval.'},
                status=status.HTTP_202_ACCEPTED
            )
            
        elif group.privacy == 'hidden':
            return Response(
                {'error': 'This group is hidden and requires an invite to join.'},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(
            {'error': 'Invalid group privacy setting.'},
            status=status.HTTP_400_BAD_REQUEST
        )

class LeaveGroupView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        
        # Check if the user is the creator
        if group.creator == request.user:
            return Response(
                {'error': 'The creator of the group cannot leave it.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            membership = GroupMembership.objects.get(user=request.user, group=group)
        except GroupMembership.DoesNotExist:
            return Response(
                {'error': 'You are not a member of this group.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Store a reference to the user before deleting membership
        user_leaving = membership.user

        # Delete the membership
        membership.delete()

        # Handle admin transfers if the leaving user was the only admin
        remaining_admins = group.admins.all()
        if not remaining_admins.exists():
            # If no admins are left, assign the oldest member as the new admin
            oldest_member = group.members.filter(status='approved').order_by('joined_at').first()
            if oldest_member:
                GroupAdmin.objects.create(user=oldest_member.user, group=group)
                Notification.objects.create(
                    user=oldest_member.user,
                    group=group,
                    message=f'You have been promoted to admin of the group "{group.name}".'
                )
        
        # Notify the user who left
        Notification.objects.create(
            user=user_leaving,
            group=group,
            message=f'You have left the group "{group.name}".'
        )
        
        return Response(
            {'message': 'You have successfully left the group.'},
            status=status.HTTP_200_OK
        )

# ==================== Invites ====================
class GroupInviteCreateView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [GroupInviteThrottle]

    def post(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)

        # Check if the user is a group admin
        if not group.admins.filter(id=request.user.id).exists():
            return Response(
                {'error': 'Only group admins can create invites.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = GroupInviteCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        # Generate a unique token
        token = get_random_string(length=32)
        while GroupInvite.objects.filter(token=token).exists():
            token = get_random_string(length=32)
        
        expires_at = serializer.validated_data.get('expires_at')
        max_uses = serializer.validated_data.get('max_uses')

        # Create the invite
        invite = GroupInvite.objects.create(
            group=group,
            created_by=request.user,
            token=token,
            expires_at=expires_at,
            max_uses=max_uses
        )

        # Return the full invite details, including the token
        response_serializer = GroupInviteDetailSerializer(invite)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class GroupInviteListView(APIView):
    """
    List and create group invites
    GET: List all active invites (admins only)
    POST: Create new invite (admins only)
    """
    permission_classes = [permissions.IsAuthenticated, IsGroupAdmin]
    throttle_classes = [GroupInviteThrottle]

    def get_group(self, group_id):
        """Get group with prefetch optimization"""
        return get_object_or_404(
            Group.objects.prefetch_related('admins'),
            id=group_id
        )

    def get(self, request, group_id):
        group = self.get_group(group_id)
        invites = GroupInvite.objects.filter(
            group=group,
            expires_at__gt=timezone.now()
        ).select_related('created_by')
        
        serializer = GroupInviteDetailSerializer(invites, many=True)
        return Response(serializer.data)

    
    
    def post(self, request, group_id):
        group = self.get_group(group_id)
        
        # Hidden groups require invite tokens
        if group.privacy == 'hidden' and not request.data.get('invite_type') == 'email':
            return Response(
                {"error": "Hidden groups require email invites"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = GroupInviteCreateSerializer(
            data=request.data,
            context={'request': request, 'group': group}
        )
        
        if serializer.is_valid():
            invite = serializer.save()
            return Response(
                GroupInviteDetailSerializer(invite).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, group_id, invite_id):
        invite = get_object_or_404(GroupInvite, id=invite_id, group_id=group_id)
        invite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==================== Analytics ====================
class GroupAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnalyticsThrottle]

    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        
        if not group.admins.filter(id=request.user.id).exists():
            return Response(
                {'error': 'Only admins can view analytics'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        analytics, _ = GroupAnalytics.objects.get_or_create(group=group)
        analytics.update_analytics()
        
        serializer = GroupAnalyticsSerializer(analytics)
        return Response(serializer.data)

class MemberActivityView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnalyticsThrottle]

    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        
        if not group.admins.filter(id=request.user.id).exists():
            return Response(
                {'error': 'Only admins can view member activity'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        active_members = group.groupmembership_set.filter(
            joined_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).select_related('user')
        
        new_members = group.groupmembership_set.filter(
            joined_at__gte=timezone.now() - timezone.timedelta(days=7)
        ).select_related('user')
        
        return Response({
            'active_members': GroupMembershipBasicSerializer(active_members, many=True).data,
            'new_members': GroupMembershipBasicSerializer(new_members, many=True).data,
            'active_count': active_members.count(),
            'new_count': new_members.count()
        })

class EventAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AnalyticsThrottle]

    def get(self, request, group_id):
        group = get_object_or_404(Group, pk=group_id)
        
        if not group.admins.filter(id=request.user.id).exists():
            return Response(
                {'error': 'Only admins can view event analytics'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        total_events = group.events.count()
        upcoming_events = group.events.filter(
            start_time__gt=timezone.now()
        ).count()
        past_events = group.events.filter(
            end_time__lt=timezone.now()
        ).count()
        
        events_with_attendance = group.events.annotate(
            attendance_count=Count('participations')
        ).order_by('-start_time')[:10]
        
        attendance_data = [{
            'event_id': event.id,
            'title': event.title,
            'date': event.start_time,
            'attendance': event.attendance_count,
            'max_participants': event.max_participants
        } for event in events_with_attendance]
        
        return Response({
            'total_events': total_events,
            'upcoming_events': upcoming_events,
            'past_events': past_events,
            'attendance_data': attendance_data
        })

class AcceptInviteView(APIView):
    """
    Handle invite acceptance when users click invite links.
    This view validates the token and adds the user to the group.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [GroupJoinThrottle]

    def post(self, request, token):
        try:
            # Find the invite by token
            invite = GroupInvite.objects.get(token=token)
            
            # Check if invite is still valid
            if not invite.is_valid():
                return Response(
                    {
                        'error': 'This invite has expired or has been fully used.',
                        'details': {
                            'expired': invite.expires_at and invite.expires_at < timezone.now(),
                            'fully_used': invite.max_uses and invite.times_used >= invite.max_uses
                        }
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if user is already a member
            existing_membership = GroupMembership.objects.filter(
                user=request.user,
                group=invite.group
            ).first()
            
            if existing_membership:
                if existing_membership.status == 'approved':
                    return Response(
                        {'error': 'You are already a member of this group.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                elif existing_membership.status == 'pending':
                    return Response(
                        {'error': 'You already have a pending membership request for this group.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                elif existing_membership.status == 'rejected':
                    return Response(
                        {'error': 'Your previous membership request was rejected.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Create or update membership
            membership, created = GroupMembership.objects.update_or_create(
                user=request.user,
                group=invite.group,
                defaults={
                    'status': 'approved',
                    'role': 'member',
                    'reviewed_by': invite.created_by,
                    'reviewed_at': timezone.now()
                }
            )
            
            # Mark the invite as used
            invite.use_invite()
            
            # Create notification for group admins
            Notification.objects.bulk_create([
                Notification(
                    user=admin,
                    group=invite.group,
                    message=f"{request.user.username} joined {invite.group.name} via invite",
                    notification_type="new_member",
                    related_object_id=membership.id
                )
                for admin in invite.group.admins.all()
            ])
            
            return Response({
                'message': f'Successfully joined {invite.group.name}!',
                'group': {
                    'id': invite.group.id,
                    'name': invite.group.name,
                    'slug': invite.group.slug
                },
                'membership': {
                    'status': membership.status,
                    'role': membership.role
                }
            }, status=status.HTTP_200_OK)
            
        except GroupInvite.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired invite token.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'An error occurred while processing the invite.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserGroupsView(APIView):
    """
    Returns a list of groups that the currently authenticated user is a member of.
    """
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get(self, request):
        print(f"UserGroupsView: User {request.user.id} requesting groups")
        try:
            memberships = GroupMembership.objects.filter(user=request.user, status='approved').select_related('group')
            print(f"UserGroupsView: Found {memberships.count()} memberships")
            groups = [membership.group for membership in memberships]
            print(f"UserGroupsView: Extracted {len(groups)} groups")
            
            # Annotate groups with member count
            groups_with_count = Group.objects.filter(
                id__in=[group.id for group in groups]
            ).annotate(
                annotated_member_count=Count('groupmembership', distinct=True)
            )
            print(f"UserGroupsView: Annotated {groups_with_count.count()} groups")
            
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(groups_with_count, request)
            
            # Using GroupListSerializer to maintain a consistent group representation
            serializer = GroupListSerializer(page, many=True, context={'request': request})
            print(f"UserGroupsView: Serialized {len(serializer.data)} groups")
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            print(f"UserGroupsView: Error - {str(e)}")
            raise