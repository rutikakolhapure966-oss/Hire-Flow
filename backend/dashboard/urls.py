from django.urls import path
from dashboard.views import RecruiterDashboardView, CandidateDashboardView

urlpatterns = [
    path('recruiter/', RecruiterDashboardView.as_view(), name='recruiter_dashboard'),
    path('candidate/', CandidateDashboardView.as_view(), name='candidate_dashboard'),
]
