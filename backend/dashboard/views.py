from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from jobs.models import Job
from applications.models import Application
from companies.models import Company
from accounts.models import User


class RecruiterDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'recruiter':
            return Response(
                {'error': 'Only recruiters can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get recruiter's jobs
        jobs = Job.objects.filter(posted_by=request.user)
        total_jobs = jobs.count()
        active_jobs = jobs.filter(is_active=True).count()
        
        # Get applications
        applications = Application.objects.filter(job__posted_by=request.user)
        total_applications = applications.count()
        
        # Applications by status
        applications_by_status = dict(
            applications.values('status').annotate(count=Count('id')).values_list('status', 'count')
        )
        
        # Recent applicants
        recent_applicants = applications.select_related('candidate').order_by('-created_at')[:5]
        
        # Applications per month (last 6 months)
        six_months_ago = timezone.now() - timedelta(days=180)
        apps_per_month = []
        for i in range(6):
            month_date = timezone.now() - timedelta(days=30*i)
            count = applications.filter(
                created_at__month=month_date.month,
                created_at__year=month_date.year
            ).count()
            apps_per_month.append({
                'month': month_date.strftime('%B'),
                'count': count
            })
        
        return Response({
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'total_applications': total_applications,
            'applications_by_status': applications_by_status,
            'recent_applicants': [
                {
                    'id': str(app.candidate.id),
                    'name': app.candidate.get_full_name(),
                    'email': app.candidate.email,
                    'job_title': app.job.title,
                    'status': app.status,
                    'applied_at': app.created_at
                }
                for app in recent_applicants
            ],
            'applications_per_month': apps_per_month
        })


class CandidateDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'candidate':
            return Response(
                {'error': 'Only candidates can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        applications = Application.objects.filter(candidate=request.user)
        saved_jobs = request.user.saved_jobs.count()
        
        applications_by_status = dict(
            applications.values('status').annotate(count=Count('id')).values_list('status', 'count')
        )
        
        recent_applications = applications.select_related('job').order_by('-created_at')[:5]
        
        return Response({
            'total_applications': applications.count(),
            'saved_jobs': saved_jobs,
            'applications_by_status': applications_by_status,
            'recent_applications': [
                {
                    'id': str(app.id),
                    'job_title': app.job.title,
                    'company': app.job.company.name,
                    'status': app.status,
                    'applied_at': app.created_at
                }
                for app in recent_applications
            ]
        })
