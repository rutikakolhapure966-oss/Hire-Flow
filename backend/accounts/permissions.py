from rest_framework.permissions import BasePermission

class IsRecruiter(BasePermission):
    """Allow access only to users with role 'recruiter'"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'recruiter')

class IsAdmin(BasePermission):
    """Allow access only to users with role 'admin'"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin')
