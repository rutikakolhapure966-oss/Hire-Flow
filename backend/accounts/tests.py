from django.test import TestCase
from accounts.models import User, CandidateProfile, RecruiterProfile


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            role='candidate'
        )
    
    def test_user_creation(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.role, 'candidate')
    
    def test_candidate_profile_creation(self):
        self.assertTrue(hasattr(self.user, 'candidate_profile'))
