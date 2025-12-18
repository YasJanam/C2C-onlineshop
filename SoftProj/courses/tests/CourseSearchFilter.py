from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from courses.models import Course, Session, CourseOffering
"""
class CourseOfferingSearchTestCase(TestCase):
    def setUp(self):
        # ایجاد Courses و Sessions
        self.course1 = Course.objects.create(code="CS101", name="Intro to CS", unit=3)
        self.course2 = Course.objects.create(code="CS102", name="Data Structures", unit=4)
        self.course3 = Course.objects.create(code="CS103", name="Algorithms", unit=3)

        self.session1 = Session.objects.create(day_of_week="Monday", time_slot="10-12", location="Room 101")
        self.session2 = Session.objects.create(day_of_week="Wednesday", time_slot="14-16", location="Room 102")

        self.offering1 = CourseOffering.objects.create(
            course=self.course1,
            prof_name="Dr. Alice",
            capacity=25,
            semester="1403-1",
            group_code="A"
        )
        self.offering1.sessions.set([self.session1])

        self.offering2 = CourseOffering.objects.create(
            course=self.course2,
            prof_name="Dr. Alice",
            capacity=30,
            semester="1403-1",
            group_code="B"
        )
        self.offering2.sessions.set([self.session2])

        self.offering3 = CourseOffering.objects.create(
            course=self.course3,
            prof_name="Dr. Bob",
            capacity=20,
            semester="1403-1",
            group_code="C"
        )
        self.offering3.sessions.set([self.session1])

        self.client = APIClient()

    def test_search_by_prof_name_returns_all_courses_for_that_prof(self):
        url = reverse('courseoffering-list')
        response = self.client.get(url, {"prof_name": "Alice"})  # case-insensitive

        self.assertEqual(response.status_code, 200)
        for item in response.data:
            self.assertIn("Alice", item["prof_name"])

        self.assertGreaterEqual(len(response.data), 2)
"""
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from courses.models import Course, Session, CourseOffering

class CourseOfferingSearchTestCase(APITestCase):

    def setUp(self):
        # Courses
        self.course1 = Course.objects.create(code="CS101", name="Intro to CS", unit=3)
        self.course2 = Course.objects.create(code="CS102", name="Data Structures", unit=3)

        # Sessions
        self.session1 = Session.objects.create(day_of_week="Monday", time_slot="10-12", location="Room 101")
        self.session2 = Session.objects.create(day_of_week="Wednesday", time_slot="14-16", location="Room 102")

        # Course Offerings
        self.offering1 = CourseOffering.objects.create(
            course=self.course1,
            prof_name="Dr. X",
            capacity=30,
            semester=20251,
            group_code="A"
        )
        self.offering1.sessions.set([self.session1])

        self.offering2 = CourseOffering.objects.create(
            course=self.course2,
            prof_name="Dr. Y",
            capacity=25,
            semester=20251,
            group_code="B"
        )
        self.offering2.sessions.set([self.session2])

        self.client = APIClient()
        self.base_url = reverse('courseoffering-list') 

    # ---------- SEARCH BY COURSE NAME ----------

    def test_search_by_course_name(self):
        url = f"{self.base_url}?course_name=Data+Structures"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['course_name'], "Data Structures")
        self.assertEqual(response.data[0]['prof_name'], "Dr. Y")

    # ---------- SEARCH BY PROF NAME ----------

    def test_search_by_prof_name(self):
        url = f"{self.base_url}?prof_name=Dr.+X"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['course_name'], "Intro to CS")
        self.assertEqual(response.data[0]['prof_name'], "Dr. X")
