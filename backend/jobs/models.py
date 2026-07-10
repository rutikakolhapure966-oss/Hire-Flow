from django.db import models
from django.contrib.auth import get_user_model
from companies.models import Company
import uuid

User = get_user_model()


class Job(models.Model):
    """Job posting model"""
    
    EMPLOYMENT_TYPE_CHOICES = [
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('contract', 'Contract'),
        ('temporary', 'Temporary'),
        ('internship', 'Internship'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('executive', 'Executive'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='posted_jobs')
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    responsibilities = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    benefits = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='full-time')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='entry')
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    skills_required = models.TextField(help_text="Comma-separated skills", blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deadline = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['company', 'is_active']),
            models.Index(fields=['employment_type']),
            models.Index(fields=['experience_level']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} at {self.company.name}"
