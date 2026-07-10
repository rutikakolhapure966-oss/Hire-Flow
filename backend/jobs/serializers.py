from rest_framework import serializers
from jobs.models import Job
from companies.serializers import CompanySerializer


class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__('companies.models', fromlist=['Company']).Company.objects.all(),
        write_only=True,
        source='company'
    )
    
    class Meta:
        model = Job
        fields = ['id', 'company', 'company_id', 'posted_by', 'title', 'slug', 'description',
                  'responsibilities', 'requirements', 'benefits', 'location', 'employment_type',
                  'experience_level', 'salary_min', 'salary_max', 'currency', 'skills_required',
                  'is_active', 'created_at', 'updated_at', 'deadline']
        read_only_fields = ['id', 'slug', 'posted_by', 'created_at', 'updated_at']
