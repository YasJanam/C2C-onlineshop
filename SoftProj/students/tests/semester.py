from rest_framework.test import APITestCase
from rest_framework import status
from students.models import Semester


class SemesterAPITestCase(APITestCase):

    def setUp(self):
        self.semester1 = Semester.objects.create(
            year=2025,
            term=1,
            is_active=True
        )
        self.base_url = '/semesters/'

    # ---------- LIST ----------

    def test_list_semesters(self):
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # ---------- RETRIEVE ----------

    def test_retrieve_semester(self):
        response = self.client.get(f"{self.base_url}{self.semester1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['year'], 2025)
        self.assertEqual(response.data['term'], 1)
        self.assertEqual(response.data['code'], 20251)
        self.assertTrue(response.data['is_active'])

    # ---------- CREATE ----------

    def test_create_semester(self):
        data = {
            "year": 2025,
            "term": 2,
            "is_active": False
        }

        response = self.client.post(self.base_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Semester.objects.count(), 2)
        semester = Semester.objects.latest('id')

        self.assertEqual(semester.code, 20252)

    # ---------- UPDATE (PATCH) ----------

    def test_update_semester(self):
        data = {
            "is_active": False
        }

        response = self.client.patch(
            f"{self.base_url}{self.semester1.id}/",
            data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.semester1.refresh_from_db()
        self.assertFalse(self.semester1.is_active)

    # ---------- UPDATE YEAR/TERM (code auto-update) ----------

    def test_update_year_term_updates_code(self):
        data = {
            "year": 2026,
            "term": 3
        }

        response = self.client.patch(
            f"{self.base_url}{self.semester1.id}/",
            data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.semester1.refresh_from_db()
        self.assertEqual(self.semester1.code, 20263)

    # ---------- DELETE ----------

    def test_delete_semester(self):
        response = self.client.delete(
            f"{self.base_url}{self.semester1.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Semester.objects.count(), 0)
