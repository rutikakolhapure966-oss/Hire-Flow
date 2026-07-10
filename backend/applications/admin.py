from django.contrib import admin
from applications.models import Application, SavedJob


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'job', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['candidate__email', 'job__title']


@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['candidate', 'job', 'created_at']
    search_fields = ['candidate__email', 'job__title']
