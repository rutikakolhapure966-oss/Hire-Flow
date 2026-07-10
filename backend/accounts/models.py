from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
import uuid


class User(AbstractUser):
    """Custom User model with role-based access control"""
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('recruiter', 'Recruiter'),
        ('candidate', 'Candidate'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidate')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    bio = models.TextField(blank=True, null=True, max_length=500)
    date_of_birth = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class CandidateProfile(models.Model):
    """Extended profile for candidates"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    resume = models.FileField(
        upload_to='resumes/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])]
    )
    skills = models.TextField(help_text="Comma-separated skills", blank=True)
    experience_years = models.IntegerField(default=0, null=True, blank=True)
    current_title = models.CharField(max_length=255, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Candidate Profile'
        verbose_name_plural = 'Candidate Profiles'
    
    def __str__(self):
        return f"{self.user.email}'s Profile"


class RecruiterProfile(models.Model):
    """Extended profile for recruiters"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    company = models.OneToOneField(
        'companies.Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='primary_recruiter'
    )
    department = models.CharField(max_length=255, blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Recruiter Profile'
        verbose_name_plural = 'Recruiter Profiles'
    
    def __str__(self):
        return f"{self.user.email}'s Recruiter Profile"
