from rest_framework import permissions
from django.core.exceptions import ObjectDoesNotExist
import logging
from .models import Group

logger = logging.getLogger(__name__)

class IsGroupAdmin(permissions.BasePermission):
    """
    Custom permission to only allow group administrators to perform actions.
    Handles both direct object checks and lookup-based permissions.
    """
    
    message = "You must be a group administrator to perform this action."

    def has_permission(self, request, view):
        # First check if the user is authenticated
        if not request.user.is_authenticated:
            return False
            
        # For list/create views, check if user is admin of any group
        if view.action in ['list', 'create']:
            return request.user.groupadmin_set.exists()
            
        return True

    def has_object_permission(self, request, view, obj):
        try:
            # Handle both Group and related objects
            group = obj if hasattr(obj, 'admins') else obj.group
            return group.admins.filter(id=request.user.id).exists()
        except (AttributeError, ObjectDoesNotExist) as e:
            logger.warning(
                f"Permission check failed for user {request.user.id} "
                f"on object {obj}: {str(e)}"
            )
            return False


class IsGroupCreator(IsGroupAdmin):
    """Strict permission requiring user to be the original group creator"""
    
    message = "Only the group creator can perform this action."

    def has_object_permission(self, request, view, obj):
        try:
            group = obj if hasattr(obj, 'creator') else obj.group
            return group.creator_id == request.user.id
        except (AttributeError, ObjectDoesNotExist) as e:
            logger.error(
                f"Creator permission check failed for user {request.user.id}: {str(e)}"
            )
            return False


class GroupActionPermissions(permissions.BasePermission):
    """
    Composite permission for different group actions:
    - Create: Any authenticated user
    - Update: Group admins
    - Delete: Only creator
    - Read: Public groups or members
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return view.action in ['list', 'retrieve']
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ['retrieve', 'list']:
            return (obj.privacy == 'public' or 
                   obj.groupmembership_set.filter(user=request.user).exists())
                   
        if view.action in ['update', 'partial_update']:
            return obj.admins.filter(id=request.user.id).exists()
            
        if view.action == 'destroy':
            return obj.creator_id == request.user.id
            
        return False
    
class IsEventParticipant(permissions.BasePermission):
    """Allows only participants or event organizers to view"""
    def has_object_permission(self, request, view, obj):
        return (
            obj.user == request.user or
            obj.event.group.admins.filter(id=request.user.id).exists()
        )

class IsEventParticipantOrAdmin(permissions.BasePermission):
    """Allows event participants or group admins to perform actions"""
    def has_object_permission(self, request, view, obj):
        # Check if user is the participant
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        # Check if user is a group admin
        if hasattr(obj, 'event') and obj.event.group.admins.filter(id=request.user.id).exists():
            return True
            
        return False