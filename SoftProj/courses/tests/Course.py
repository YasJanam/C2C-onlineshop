from django.test import TestCase
from django.core.exceptions import ValidationError
from courses.models import Course
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class CourseModelTest(TestCase):

    def setUp(self):
        self.course = Course.objects.create(
            name="Algorithms",
            code="CS101",
            unit=3
        )

    def test_course_creation(self):
        self.assertEqual(self.course.name, "Algorithms")
        self.assertEqual(self.course.code, "CS101")
        self.assertEqual(self.course.unit, 3)

    def test_course_str(self):
        self.assertEqual(str(self.course), "Algorithms (CS101)")

    def test_course_code_unique(self):
        with self.assertRaises(Exception):
            Course.objects.create(
                name="Advanced Algorithms",
                code="CS101",  # duplicate
                unit=3
            )

    def test_unit_min_validation(self):
        course = Course(
            name="Invalid Course",
            code="CS102",
            unit=0
        )
        with self.assertRaises(ValidationError):
            course.full_clean()

    def test_unit_max_validation(self):
        course = Course(
            name="Invalid Course",
            code="CS103",
            unit=4
        )
        with self.assertRaises(ValidationError):
            course.full_clean()

    #  تست prerequisite
    def test_prerequisite_relationship(self):
        prereq = Course.objects.create(
            name="Programming Basics",
            code="CS100",
            unit=3
        )

        self.course.prerequisites.add(prereq)

        self.assertIn(prereq, self.course.prerequisites.all())
        self.assertIn(self.course, prereq.required_for.all())



class CourseAPITestCase(APITestCase):

    def setUp(self):
        # چند درس نمونه برای تست prerequisites
        self.course1 = Course.objects.create(name="Math", code="MATH101", unit=3)
        self.course2 = Course.objects.create(name="Physics", code="PHYS101", unit=3)

        self.list_url = reverse('course-list')  
        self.detail_url = lambda pk: reverse('course-detail', args=[pk])

    def test_create_course_success(self):
        data = {
            "name": "Chemistry",
            "code": "CHEM101",
            "unit": 3,
            "prerequisites": [self.course1.code, self.course2.code]
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 3)
        self.assertEqual(response.data['name'], "Chemistry")
        self.assertEqual(len(response.data['prerequisites']), 2)

    def test_create_course_duplicate_code(self):
        data = {
            "name": "Duplicate Course",
            "code": self.course1.code,  # همان کد درس موجود
            "unit": 3,
            "prerequisites": []
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            "course with this course code already exists.",
            str(response.data)
        )


    def test_list_courses(self):
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_course(self):
        response = self.client.get(self.detail_url(self.course1.pk), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], self.course1.code)

    def test_update_course(self):
        data = {
            "name": "Advanced Math",
            "code": "MATH101",
            "unit": 3,
            "prerequisites": [self.course2.code]
        }
        response = self.client.put(self.detail_url(self.course1.pk), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course1.refresh_from_db()
        self.assertEqual(self.course1.name, "Advanced Math")
        self.assertEqual(list(self.course1.prerequisites.all()), [self.course2])

    def test_partial_update_course(self):
        data = {"name": "Basic Physics"}
        response = self.client.patch(self.detail_url(self.course2.pk), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course2.refresh_from_db()
        self.assertEqual(self.course2.name, "Basic Physics")

    def test_delete_course(self):
        response = self.client.delete(self.detail_url(self.course1.pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Course.objects.filter(pk=self.course1.pk).exists())
