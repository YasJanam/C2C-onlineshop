from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from students.models import StudentSemester, Semester
from django.urls import reverse


class StudentSemesterAPITestCase(APITestCase):

    def setUp(self):
        # ایجاد دانشجو
        self.user = User.objects.create_user(
            username='student1',
            password='pass123'
        )

        # ایجاد ترم‌ها
        self.semester1 = Semester.objects.create(year=2025, term=1)  # code = 20251
        self.semester2 = Semester.objects.create(year=2025, term=2)  # code = 20252

        # ایجاد StudentSemester اولیه
        self.ss = StudentSemester.objects.create(
            student=self.user,
            semester=self.semester1,
            total_units=18,
            min_units=12,
            max_units=24
        )

        self.base_url = '/student-semester/'

    # ---------- CRUD TESTS ----------

    def test_list_student_semesters(self):
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_student_semester(self):
        response = self.client.get(f"{self.base_url}{self.ss.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_units'], 18)

    def test_create_student_semester(self):
        data = {
            "student_username": self.user.username,
            "semester_code": self.semester2.code,
            "total_units": 20,
            "min_units": 12,
            "max_units": 24
        }

        response = self.client.post(self.base_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(StudentSemester.objects.count(), 2)

    def test_update_student_semester(self):
        data = {
            "total_units": 22
        }

        response = self.client.patch(
            f"{self.base_url}{self.ss.id}/",
            data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.ss.refresh_from_db()
        self.assertEqual(self.ss.total_units, 22)

    def test_delete_student_semester(self):
        response = self.client.delete(f"{self.base_url}{self.ss.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(StudentSemester.objects.count(), 0)

    # ---------- CUSTOM ACTION: update max/min units ----------

    def test_update_units_success(self):
        data = {
            "student_username": "student1",
            "semester_code": self.semester1.code,
            "min_units": 14,
            "max_units": 20
        }

        response = self.client.patch(
            f"{self.base_url}maxmin-units/",
            data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.ss.refresh_from_db()
        self.assertEqual(self.ss.min_units, 14)
        self.assertEqual(self.ss.max_units, 20)

    def test_update_units_invalid_min_max(self):
        data = {
            "student_username": "student1",
            "semester_code": self.semester1.code,
            "min_units": 25,
            "max_units": 20
        }

        response = self.client.patch(
            f"{self.base_url}maxmin-units/",
            data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            'min_units cannot be greater than max_units',
            str(response.data)
        )

    def test_update_units_not_found(self):
        data = {
            "student_username": "nonexistent",
            "semester_code": self.semester1.code,
            "min_units": 14,
            "max_units": 20
        }

        response = self.client.patch(
            f"{self.base_url}maxmin-units/",
            data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn(
            'StudentSemester not found',
            str(response.data)
        )

    # ---------- CUSTOM ACTION: courses in semester ----------

    def test_courses_in_semester_missing_code(self):
        response = self.client.get(
            f"{self.base_url}courses-in-semester/"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            'semester_code is required',
            str(response.data)
        )
