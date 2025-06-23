# groups/mixins.py
from rest_framework.response import Response
from rest_framework import status
class GroupAdminMixin:
    def check_admin(self, group, user):
        if not group.admins.filter(id=user.id).exists():
            return Response(
                {'error': 'Group admin required'},
                status=status.HTTP_403_FORBIDDEN
            )
        return None