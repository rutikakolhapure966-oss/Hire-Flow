from rest_framework import serializers
from companies.models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'slug', 'description', 'logo', 'website', 'email', 'phone',
                  'location', 'city', 'country', 'founded_year', 'company_size', 'industry',
                  'linkedin_url', 'twitter_url', 'is_verified', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
