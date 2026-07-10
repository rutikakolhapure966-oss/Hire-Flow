from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from accounts.models import User, CandidateProfile, RecruiterProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_verified', 'created_at']
    list_filter = ['role', 'is_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone_number', 'profile_picture', 'bio', 'location', 'website', 'linkedin_url', 'github_url', 'is_verified')}),
    )


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_title', 'experience_years', 'created_at']
    list_filter = ['experience_years', 'created_at']
    search_fields = ['user__email', 'current_title']


@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'department', 'designation']
    list_filter = ['department', 'created_at']
    search_fields = ['user__email', 'company__name']
