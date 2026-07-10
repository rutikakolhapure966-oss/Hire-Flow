from django.db import models
from django.contrib.auth import get_user_model
from jobs.models import Job
import uuid

User = get_user_model()


class Application(models.Model):
    """Job application model"""
    
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    cover_letter = models.TextField(blank=True, null=True)
    resume_snapshot = models.FileField(upload_to='resume_snapshots/', blank=True, null=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    rating = models.IntegerField(default=0, choices=[(i, i) for i in range(0, 6)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ('job', 'candidate')
        indexes = [
            models.Index(fields=['job', 'candidate']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.candidate.email} applied for {self.job.title}"


class SavedJob(models.Model):
    """Model to track saved jobs by candidates"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('job', 'candidate')
        indexes = [
            models.Index(fields=['candidate', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.candidate.email} saved {self.job.title}"
