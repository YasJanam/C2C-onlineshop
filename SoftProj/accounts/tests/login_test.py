from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status

class LoginAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='1234'
        )

    def test_login(self):
        url = reverse('login')
        response = self.client.post(url, {
            'username': 'testuser',
            'password': '1234'
        }, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)



class LogoutAPITest(APITestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username='testuser',
            password='1234'
        )

        login_url = reverse('login')
        response = self.client.post(login_url, {
            'username': 'testuser',
            'password': '1234'
        }, format='json')

        self.refresh_token = response.data['refresh']
        self.access_token = response.data['access']

    def test_logout_success(self):
        logout_url = reverse('logout')

        response = self.client.post(
            logout_url,
            {'refresh': self.refresh_token},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Logged out successfully')
