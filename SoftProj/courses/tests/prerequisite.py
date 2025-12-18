# courses/tests/test_prerequisites.py
from rest_framework import status
from django.urls import reverse
from courses.models import Course
from django.test import TestCase
from rest_framework.test import APITestCase, APIClient


class PrerequisiteAPITest(APITestCase):

    def setUp(self):
        self.course1 = Course.objects.create(
            name="Algorithms",
            code="C101",
            unit=3
        )
        self.course2 = Course.objects.create(
            name="Data Structures",
            code="C102",
            unit=3
        )

        self.url = reverse("course-detail", args=[self.course1.id])

    def test_add_and_remove_prerequisite(self):

        #  add prerequisite
        response = self.client.patch(
            self.url,
            {"prerequisites": ["C102"]},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course1.refresh_from_db()
        self.assertIn(self.course2, self.course1.prerequisites.all())

        #  remove prerequisite
        response = self.client.patch(
            self.url,
            {"prerequisites": []},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course1.refresh_from_db()
        self.assertNotIn(self.course2, self.course1.prerequisites.all())


# برای اندپوینت دستی
class CoursePrerequisiteAPITest2(TestCase):
    def setUp(self):
        self.client = APIClient()

        # ساخت چند درس نمونه
        self.course1 = Course.objects.create(name="Course 1", code="C001")
        self.course2 = Course.objects.create(name="Course 2", code="C002")

     
        self.add_url = "/courses/add-prerequisite/"
        self.remove_url = "/courses/remove-prerequisite/"

    def test_add_and_remove_prerequisite(self):

        add_data = {
            "coursecode": self.course1.code,
            "prereqcode": self.course2.code
        }
        add_response = self.client.post(self.add_url, add_data, format="json")
        self.assertEqual(add_response.status_code, status.HTTP_200_OK)
        self.assertIn("message", add_response.data)
        self.assertEqual(add_response.data["message"], "Prerequisite added")

        # بررسی اینکه پیش‌نیاز در DB اضافه شده
        self.course1.refresh_from_db()
        self.assertTrue(self.course1.prerequisites.filter(id=self.course2.id).exists())

        # --- حذف پیش‌نیاز ---
        remove_data = {
            "coursecode": self.course1.code,
            "prereqcode": self.course2.code
        }
        remove_response = self.client.post(self.remove_url, remove_data, format="json")
        self.assertEqual(remove_response.status_code, status.HTTP_200_OK)
        self.assertIn("message", remove_response.data)
        self.assertEqual(remove_response.data["message"], "Prerequisite removed")

        # بررسی اینکه پیش‌نیاز از DB حذف شده
        self.course1.refresh_from_db()
        self.assertFalse(self.course1.prerequisites.filter(id=self.course2.id).exists())

# برای اندپوینت دستی
class CoursePrerequisiteAPITestCase(APITestCase):

    def setUp(self):
        # ایجاد چند Course
        self.course1 = Course.objects.create(code="CS101", name="Intro to CS", unit=3)
        self.course2 = Course.objects.create(code="CS102", name="Data Structures", unit=3)
        self.course3 = Course.objects.create(code="CS103", name="Algorithms", unit=3)

        self.client = APIClient()
        self.base_url = reverse("course-list")  

    # ---------- TEST ADD PREREQUISITE ----------

    def test_add_prerequisite(self):
        url = f"{self.base_url}add-prerequisite/"
        data = {
            "coursecode": self.course3.code,  
            "prereqcode": self.course2.code
        }

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Prerequisite added", response.data["message"])

        # بررسی اینکه prereq اضافه شده
        self.course3.refresh_from_db()
        self.assertIn(self.course2, self.course3.prerequisites.all())

    # ---------- TEST REMOVE PREREQUISITE ----------

    def test_remove_prerequisite(self):
        # ابتدا اضافه می‌کنیم تا بعد حذف شود
        self.course3.prerequisites.add(self.course2)

        url = f"{self.base_url}remove-prerequisite/"
        data = {
            "coursecode": self.course3.code,
            "prereqcode": self.course2.code
        }

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Prerequisite removed", response.data["message"])

        # بررسی اینکه prereq حذف شده
        self.course3.refresh_from_db()
        self.assertNotIn(self.course2, self.course3.prerequisites.all())
