from rest_framework import serializers
from applications.models import Application, SavedJob
from jobs.serializers import JobSerializer
from accounts.serializers import UserSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    candidate = UserSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__('jobs.models', fromlist=['Job']).Job.objects.all(),
        write_only=True,
        source='job'
    )
    
    class Meta:
        model = Application
        fields = ['id', 'job', 'job_id', 'candidate', 'status', 'cover_letter',
                  'resume_snapshot', 'interview_date', 'notes', 'rating', 'created_at', 'updated_at']
        read_only_fields = ['id', 'candidate', 'created_at', 'updated_at']


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    candidate = UserSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__('jobs.models', fromlist=['Job']).Job.objects.all(),
        write_only=True,
        source='job'
    )
    
    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'job_id', 'candidate', 'created_at']
        read_only_fields = ['id', 'candidate', 'created_at']
