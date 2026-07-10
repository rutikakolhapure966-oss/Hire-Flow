from django.contrib import admin
from jobs.models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'employment_type', 'experience_level', 'location', 'is_active', 'created_at']
    list_filter = ['employment_type', 'experience_level', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'company__name']
    prepopulated_fields = {'slug': ('title',)}
