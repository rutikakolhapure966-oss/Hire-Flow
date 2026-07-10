from django.test import TestCase
from notifications.models import Notification
from accounts.models import User


class NotificationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@test.com',
            password='pass123',
            role='candidate'
        )
        self.notification = Notification.objects.create(
            user=self.user,
            title='Test Notification',
            message='Test message',
            notification_type='system'
        )
    
    def test_notification_creation(self):
        self.assertEqual(self.notification.title, 'Test Notification')
        self.assertFalse(self.notification.is_read)
