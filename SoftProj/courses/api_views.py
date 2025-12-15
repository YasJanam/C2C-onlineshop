# courses/api_views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Course , CourseOffering
from .serializers import *
from django.db.models import Q
from rest_framework import status

"""
# ------------- search & filter --------------

# Search course by name or prof
@api_view(['GET'])
def search_courses(request):
    course_name = request.GET.get('course_name', '')
    professor_name = request.GET.get('professor_name', '')

    queryset = CourseOffering.objects.all()

    if course_name:
        queryset = queryset.filter(name__icontains=course_name)

    if professor_name:
        queryset = queryset.filter(
            Q(professor__user__first_name__icontains=professor_name) |
            Q(professor__user__last_name__icontains=professor_name)
        )

    serializer = CourseOfferingSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# search courses by semester
@api_view(['GET'])
def offered_courses_by_semester(request):
    queryset = CourseOffering.objects.filter(semester=request.data["semester"])
    
    if not queryset.exists():
        return Response(
            {"error": f"No courses found for semester {request.data["semester"]}"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CourseOfferingSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
"""


