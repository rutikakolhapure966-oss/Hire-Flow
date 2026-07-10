from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from jobs.models import Job
from jobs.serializers import JobSerializer


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['employment_type', 'experience_level', 'location', 'company']
    search_fields = ['title', 'description', 'skills_required', 'location']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']
    ordering = ['-created_at']

    def get_queryset(self):
        # If an authenticated recruiter requests their own jobs with ?mine=true,
        # return only jobs posted by that recruiter. Otherwise return active jobs.
        request = getattr(self, 'request', None)
        if request and hasattr(request, 'user') and request.user.is_authenticated and request.query_params.get('mine') == 'true':
            return Job.objects.filter(posted_by=request.user)
        return Job.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        if request.user.role != 'recruiter':
            return Response(
                {'error': 'Only recruiters can post jobs'},
                status=status.HTTP_403_FORBIDDEN
            )
        request.data['posted_by'] = request.user.id
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)
