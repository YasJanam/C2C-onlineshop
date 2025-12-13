# courses/api_views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Course , CourseOffering
from .serializers import *
from django.db.models import Q
from rest_framework import status

# --------- course CRUD -----------

# GET all courses
@api_view(['GET'])
def get_courses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


# GET single course
@api_view(['GET'])
def get_course(request, id):
    try:
        course = Course.objects.get(id=id)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)


# CREATE new course
@api_view(['POST'])
def create_course(request):
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# UPDATE course
@api_view(['PUT'])
def update_course(request, id):
    try:
        course = Course.objects.get(id=id)
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)


# DELETE course 
@api_view(['DELETE'])
def delete_course(request):
    try:
        course = Course.objects.get(code=request.data["course-code"])
        course.delete()
        return Response(status=204)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    

# ------------- course-schedule CRUD ------------------

# CREATE new course
@api_view(['POST'])
def create_course_offering(request):
    serializer = CreateCourseOfferingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_course_offering(request):
    try:
        course = CourseOffering.objects.get(offering_code=request.data["offering-code"])
        course.delete()
        return Response(status=204)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    
# GET all courses
@api_view(['GET'])
def get_courses_offering(request):
    courses = CourseOffering.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


# GET single course
@api_view(['GET'])
def get_course_offering(request, id):
    try:
        course = CourseOffering.objects.get(id=id)
        serializer = CourseOfferingSerializer(course)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

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

"""
# Search course by name or prof (in a semester)
@api_view(['GET'])
def search_courses_by_semester(request):
    semester = request.GET.get('semester')
    course_name = request.GET.get('course_name', '')
    professor_name = request.GET.get('professor_name', '')

    if not semester:
        return Response(
            {"error": "semester parameter is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    queryset = CourseSchedule.objects.filter(semester=semester)

    if course_name:
        queryset = queryset.filter(name__icontains=course_name)

    if professor_name:
        queryset = queryset.filter(
            Q(professor__user__first_name__icontains=professor_name) |
            Q(professor__user__last_name__icontains=professor_name)
        )

    serializer = CourseScheduleSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def list_courses_by_semester(request, semester):
    queryset = CourseSchedule.objects.filter(semester=semester)
    
    if not queryset.exists():
        return Response(
            {"error": f"No courses found for semester {semester}"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CourseScheduleSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

"""

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



