from django.test import TestCase
from companies.models import Company


class CompanyModelTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(
            name='Test Company',
            slug='test-company',
            description='Test Description'
        )
    
    def test_company_creation(self):
        self.assertEqual(self.company.name, 'Test Company')
        self.assertEqual(self.company.slug, 'test-company')
