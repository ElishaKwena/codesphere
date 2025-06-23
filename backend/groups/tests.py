from django.test import TestCase

# Create your tests here.
# tests.py
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

class ThrottleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='test', 
            password='test'
        )
        self.client.force_authenticate(user=self.user)

    def test_group_create_throttle(self):
        for _ in range(3):
            response = self.client.post('/api/groups/', {...})
            self.assertEqual(response.status_code, 201)
        response = self.client.post('/api/groups/', {...})
        self.assertEqual(response.status_code, 429)  # Throttled