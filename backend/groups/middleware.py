import logging
from django.utils import timezone
from django.http import HttpResponseForbidden, JsonResponse
from django.core.exceptions import PermissionDenied
from django.db import DatabaseError
from .models import Group, GroupMembership
from django.conf import settings

logger = logging.getLogger(__name__)

class GroupActivityMiddleware:
    """Tracks group-related API performance and usage"""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip static/media files
        if request.path.startswith(settings.STATIC_URL) or request.path.startswith(settings.MEDIA_URL):
            return self.get_response(request)

        # Pre-processing
        start_time = timezone.now()
        request.group_api_metrics = {
            'start_time': start_time,
            'user_authenticated': request.user.is_authenticated
        }

        try:
            response = self.get_response(request)
        except Exception as e:
            logger.error(f"Middleware error processing {request.path}: {str(e)}")
            raise

        # Post-processing
        duration = (timezone.now() - start_time).total_seconds()
        if request.group_api_metrics['user_authenticated']:
            logger.info(
                f"GroupAPI | User:{request.user.id} | "
                f"Path:{request.path} | "
                f"Method:{request.method} | "
                f"Duration:{duration:.3f}s | "
                f"Status:{response.status_code}"
            )
        
        return response


class GroupAccessMiddleware:
    """Handles group-specific permissions and request enrichment"""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip non-group API routes
        if not request.path.startswith('/api/groups/'):
            return self.get_response(request)

        try:
            response = self.get_response(request)
        except DatabaseError as e:
            logger.critical(f"Database error in group access: {str(e)}")
            return JsonResponse(
                {'error': 'Service unavailable'}, 
                status=503
            )

        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Enrich request with group object if ID present
        if 'group_id' in view_kwargs:
            try:
                group = Group.objects.select_related('creator').get(
                    pk=view_kwargs['group_id']
                )
                request.group = group
                
                # Verify membership for non-public groups
                if (group.privacy != Group.PUBLIC and 
                    request.user.is_authenticated and
                    not GroupMembership.objects.filter(
                        user=request.user,
                        group=group,
                        status='approved'
                    ).exists()):
                    raise PermissionDenied("Not a group member")
                    
            except Group.DoesNotExist:
                logger.warning(
                    f"Attempt to access non-existent group {view_kwargs['group_id']} "
                    f"by user {getattr(request.user, 'id', 'anonymous')}"
                )
                return JsonResponse(
                    {'error': 'Group not found'}, 
                    status=404
                )
            except PermissionDenied as e:
                logger.warning(
                    f"Unauthorized group access attempt to {view_kwargs['group_id']} "
                    f"by user {request.user.id}"
                )
                return JsonResponse(
                    {'error': str(e)}, 
                    status=403
                )


class SecurityHeadersMiddleware:
    """Adds security-related HTTP headers"""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        
        if request.is_secure():
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response