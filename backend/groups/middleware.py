# middleware.py
from django.shortcuts import redirect
from django.urls import reverse
from .models import *

class GroupAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        response = self.get_response(request)
        return response
        
    def process_view(self, request, view_func, view_args, view_kwargs):
        if hasattr(view_func, 'group_permission_required'):
            group_id = view_kwargs.get('group_id') or view_kwargs.get('pk')
            if not group_id:
                return None
                
            group = Group.objects.get(pk=group_id)
            if not group.is_member(request.user):
                return redirect(reverse('group-detail', kwargs={'pk': group_id}))