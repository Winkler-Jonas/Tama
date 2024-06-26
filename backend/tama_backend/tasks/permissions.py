from rest_framework import permissions


class IsOwnerOrIsCreating(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user