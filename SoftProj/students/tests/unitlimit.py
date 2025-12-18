from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from students.models import StudentSemester, Semester

class UpdateUnitsTest(APITestCase):

    def setUp(self):
        # ایجاد یک دانشجو
        self.user = User.objects.create_user(username='student1', password='pass123')
        # ایجاد یک ترم
        self.semester = Semester.objects.create(year=2025, term=1)
        
        self.ss = StudentSemester.objects.create(
            student=self.user,
            semester=self.semester,
            min_units=12,
            max_units=24
        )
        
        self.url = '/student-semester/maxmin-units/'

    def test_update_units_success(self):
        data = {
            "student_username": "student1",
            "semester_code": 20251,
            "min_units": 14,
            "max_units": 20
        }
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ss.refresh_from_db()
        self.assertEqual(self.ss.min_units, 14)
        self.assertEqual(self.ss.max_units, 20)

    def test_update_units_invalid_min_max(self):
        data = {
            "student_username": "student1",
            "semester_code": 20251,
            "min_units": 25,  
            "max_units": 20
        }
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('min_units cannot be greater than max_units', str(response.data))

    def test_update_units_studentsemester_not_found(self):
        data = {
            "student_username": "nonexistent",
            "semester_code": 20251,
            "min_units": 14,
            "max_units": 20
        }
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('StudentSemester not found', str(response.data))
