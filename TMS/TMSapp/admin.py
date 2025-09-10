from django.contrib import admin
from .models import User,Package,Chat_Message,Offer
from django.contrib.auth.admin import UserAdmin as BASEUSER

# Register your models here.
class UserAdmin(BASEUSER):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_owner', 'is_transporter')
    list_filter = ('is_owner', 'is_transporter')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_no', 'company_name', 'address', 'state', 'country')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Roles', {'fields': ('is_owner', 'is_transporter')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'first_name', 'last_name', 'password1', 'password2',
                'is_owner', 'is_transporter', 'phone_no', 'company_name', 'address', 'state', 'country'
            ),
        }),
    )

    search_fields = ('username', 'email')
    ordering = ('username',)


admin.site.register(User,UserAdmin)
admin.site.register(Package)
admin.site.register(Chat_Message)
admin.site.register(Offer)