from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from companies.models import Company
from jobs.models import Job
from applications.models import Application

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed demo data: users, company, jobs, applications'

    def handle(self, *args, **options):
        self.stdout.write('Seeding demo data...')

        # Create users
        recruiter, _ = User.objects.get_or_create(email='recruiter@example.com', defaults={'username':'recruiter@example.com', 'role':'recruiter', 'first_name':'Jane', 'last_name':'Recruiter'})
        if not recruiter.has_usable_password():
            recruiter.set_password('password123')
            recruiter.save()

        candidate, _ = User.objects.get_or_create(email='candidate@example.com', defaults={'username':'candidate@example.com', 'role':'candidate', 'first_name':'John', 'last_name':'Candidate'})
        if not candidate.has_usable_password():
            candidate.set_password('password123')
            candidate.save()

        # Company
        company, created = Company.objects.get_or_create(name='Acme Corp', defaults={'slug':'acme-corp', 'description':'Demo company for HireFlow'})

        # Jobs
        job1, _ = Job.objects.get_or_create(title='Frontend Engineer', company=company, defaults={'slug':'frontend-engineer', 'posted_by': recruiter, 'description':'Build UIs', 'location':'Remote', 'employment_type':'Full-time', 'experience_level':'Mid'})
        job2, _ = Job.objects.get_or_create(title='Backend Engineer', company=company, defaults={'slug':'backend-engineer', 'posted_by': recruiter, 'description':'Build APIs', 'location':'Remote', 'employment_type':'Full-time', 'experience_level':'Mid'})

        # Applications
        Application.objects.get_or_create(job=job1, candidate=candidate, defaults={'cover_letter':'I am interested', 'status':'applied'})

        self.stdout.write(self.style.SUCCESS('Demo data seeded.'))
