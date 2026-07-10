from django.db import models
from django.core.validators import FileExtensionValidator, URLValidator
import uuid


class Company(models.Model):
    """Company model for storing company information"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(
        upload_to='company_logos/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'svg'])]
    )
    website = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    founded_year = models.IntegerField(null=True, blank=True)
    company_size = models.CharField(
        max_length=50,
        choices=[
            ('1-50', '1-50 employees'),
            ('51-200', '51-200 employees'),
            ('201-500', '201-500 employees'),
            ('501-1000', '501-1000 employees'),
            ('1000+', '1000+ employees'),
        ],
        blank=True
    )
    industry = models.CharField(max_length=255, blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_verified']),
            models.Index(fields=['created_at']),
        ]
        verbose_name_plural = 'Companies'
    
    def __str__(self):
        return self.name
