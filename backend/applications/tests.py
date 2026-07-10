from django.test import TestCase
from applications.models import Application, SavedJob
from jobs.models import Job
from companies.models import Company
from accounts.models import User


class ApplicationModelTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Co', slug='test-co')
        self.recruiter = User.objects.create_user(
            email='recruiter@test.com',
            password='pass123',
            role='recruiter'
        )
        self.candidate = User.objects.create_user(
            email='candidate@test.com',
            password='pass123',
            role='candidate'
        )
        self.job = Job.objects.create(
            company=self.company,
            posted_by=self.recruiter,
            title='Test Job',
            slug='test-job',
            description='Test',
            location='Test'
        )
        self.application = Application.objects.create(
            job=self.job,
            candidate=self.candidate
        )
    
    def test_application_creation(self):
        self.assertEqual(self.application.status, 'applied')
