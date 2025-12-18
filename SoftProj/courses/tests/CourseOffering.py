from rest_framework.test import APIClient
from django.urls import reverse
from courses.serializers import *

from rest_framework.test import APITestCase
from rest_framework import status
from courses.models import (
    Course,
    Session,
    CourseOffering
)


class CourseOfferingAPITestCase(APITestCase):

    def setUp(self):
        # ---------- Course ----------
        self.course = Course.objects.create(
            name="Data Structures",
            code="CS201",
            unit=3
        )

        # ---------- Sessions ----------
        self.session1 = Session.objects.create(
            day_of_week=Session.DayOfWeek.SATURDAY,
            time_slot=Session.TimeSlot.SLOT_8_10,
            location="Class A"
        )
        self.session2 = Session.objects.create(
            day_of_week=Session.DayOfWeek.MONDAY,
            time_slot=Session.TimeSlot.SLOT_10_12,
            location="Class B"
        )

        # ---------- Course Offering ----------
        self.offering = CourseOffering.objects.create(
            course=self.course,
            group_code="01",
            semester=20251,
            capacity=30,
            prof_name="Dr. Test"
        )
        self.offering.sessions.set([self.session1])

        self.base_url = "/courseofferings/"

    # ---------- LIST ----------

    def test_list_course_offerings(self):
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # ---------- RETRIEVE ----------

    def test_retrieve_course_offering(self):
        response = self.client.get(f"{self.base_url}{self.offering.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data["course_code"], "CS201")
        self.assertEqual(response.data["course_name"], "Data Structures")
        self.assertEqual(response.data["course_unit"], 3)
        self.assertEqual(response.data["capacity"], 30)

    # ---------- CREATE ----------

    def test_create_course_offering(self):
        data = {
            "course_code": "CS201",
            "group_code": "02",
            "semester": 20251,
            "capacity": 40,
            "prof_name": "Dr. New",
            "session_ids": [self.session1.id, self.session2.id]
        }

        response = self.client.post(
            self.base_url,
            data,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CourseOffering.objects.count(), 2)

        offering = CourseOffering.objects.latest("id")
        self.assertEqual(offering.code, "CS2010220251")
        self.assertEqual(offering.sessions.count(), 2)

    # ---------- UPDATE (PATCH) ----------

    def test_update_course_offering(self):
        data = {
            "capacity": 25,
            "prof_name": "Dr. Updated"
        }

        response = self.client.patch(
            f"{self.base_url}{self.offering.id}/",
            data,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.offering.refresh_from_db()
        self.assertEqual(self.offering.capacity, 25)
        self.assertEqual(self.offering.prof_name, "Dr. Updated")

    # ---------- UPDATE SESSIONS ----------

    def test_update_course_offering_sessions(self):
        data = {
            "session_ids": [self.session2.id]
        }

        response = self.client.patch(
            f"{self.base_url}{self.offering.id}/",
            data,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.offering.refresh_from_db()
        self.assertEqual(self.offering.sessions.count(), 1)
        self.assertEqual(
            self.offering.sessions.first().id,
            self.session2.id
        )

    # ---------- DELETE ----------

    def test_delete_course_offering(self):
        response = self.client.delete(
            f"{self.base_url}{self.offering.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CourseOffering.objects.count(), 0)
