from django.contrib import admin
from companies.models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry', 'city', 'country', 'company_size', 'is_verified', 'created_at']
    list_filter = ['company_size', 'industry', 'is_verified', 'created_at']
    search_fields = ['name', 'description', 'industry']
    prepopulated_fields = {'slug': ('name',)}
