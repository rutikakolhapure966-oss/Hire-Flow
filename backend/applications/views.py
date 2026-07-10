from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from applications.models import Application, SavedJob
from applications.serializers import ApplicationSerializer, SavedJobSerializer
from django.http import FileResponse, Http404
from django.conf import settings
import os


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'job']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user.role == 'candidate':
            return Application.objects.filter(candidate=self.request.user)
        elif self.request.user.role == 'recruiter':
            return Application.objects.filter(job__posted_by=self.request.user)
        return Application.objects.none()

    def create(self, request, *args, **kwargs):
        if request.user.role != 'candidate':
            return Response(
                {'error': 'Only candidates can apply for jobs'},
                status=status.HTTP_403_FORBIDDEN
            )

        job_id = request.data.get('job_id')
        if Application.objects.filter(job_id=job_id, candidate=request.user).exists():
            return Response(
                {'error': 'You have already applied for this job'},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.data['candidate'] = request.user.id
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        if request.user.role != 'recruiter':
            return Response(
                {'error': 'Only recruiters can update application status'},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')
        if new_status:
            application.status = new_status
            application.save()
            return Response(ApplicationSerializer(application).data)
        return Response(
            {'error': 'Status is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['get'])
    def download_resume(self, request, pk=None):
        """Return the resume file for this application.
        Recruiters who posted the job and the candidate who applied may download.
        """
        application = self.get_object()
        user = request.user
        # Only recruiter who owns the job or the candidate can download
        is_owner_recruiter = user.role == 'recruiter' and getattr(application.job, 'posted_by', None) == user
        is_candidate = user == application.candidate
        if not (is_owner_recruiter or is_candidate or user.role == 'admin'):
            return Response({'error': 'You do not have permission to download this resume'}, status=status.HTTP_403_FORBIDDEN)

        # Prefer the resume_snapshot attached to the application; fallback to candidate profile resume
        file_field = application.resume_snapshot or getattr(getattr(application, 'candidate', None), 'candidate_profile', None) and application.candidate.candidate_profile.resume
        if not file_field:
            return Response({'error': 'No resume available'}, status=status.HTTP_404_NOT_FOUND)

        file_path = file_field.path
        if not os.path.exists(file_path):
            return Response({'error': 'File not found on server'}, status=status.HTTP_404_NOT_FOUND)

        try:
            filename = os.path.basename(file_field.name)
            response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=filename)
            return response
        except Exception:
            raise Http404


class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(candidate=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.role != 'candidate':
            return Response(
                {'error': 'Only candidates can save jobs'},
                status=status.HTTP_403_FORBIDDEN
            )

        job_id = request.data.get('job_id')
        if SavedJob.objects.filter(job_id=job_id, candidate=request.user).exists():
            return Response(
                {'error': 'You have already saved this job'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)

    @action(detail=True, methods=['delete'])
    def remove_saved(self, request, pk=None):
        saved_job = self.get_object()
        saved_job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
