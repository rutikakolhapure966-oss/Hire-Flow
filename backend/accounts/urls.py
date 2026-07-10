from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserDetailView,
    CandidateProfileView,
    RecruiterProfileView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('candidate-profile/', CandidateProfileView.as_view(), name='candidate_profile'),
    path('recruiter-profile/', RecruiterProfileView.as_view(), name='recruiter_profile'),
]
