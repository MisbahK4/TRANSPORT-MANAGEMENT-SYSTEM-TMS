from rest_framework import permissions

class isOwnerOrReadonly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        owner = getattr(obj,'user',None) or getattr(obj,'owner',None)
        if owner is None:
            owner = getattr(obj,'sender',None)
        return owner == request.user    
        
class IsTransporterUser(permissions.BasePermission):


    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_transporter", False)
        )        