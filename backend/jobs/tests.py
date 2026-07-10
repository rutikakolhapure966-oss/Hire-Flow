from django.test import TestCase
from jobs.models import Job
from companies.models import Company
from accounts.models import User


class JobModelTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(
            name='Test Company',
            slug='test-company'
        )
        self.user = User.objects.create_user(
            email='recruiter@test.com',
            password='testpass123',
            role='recruiter'
        )
        self.job = Job.objects.create(
            company=self.company,
            posted_by=self.user,
            title='Test Job',
            slug='test-job',
            description='Test Description',
            location='Test Location'
        )
    
    def test_job_creation(self):
        self.assertEqual(self.job.title, 'Test Job')
        self.assertEqual(self.job.company, self.company)
