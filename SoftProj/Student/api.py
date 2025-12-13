from rest_framework.decorators import api_view , permission_classes
from rest_framework.response import Response
from .models import *
from rest_framework import status
from .serializers import  *
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def student_list(request):
    students = Student.objects.all()
    data = [{"id": p.id, "name": str(p)} for p in students]
    return Response(data)


@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def student_register(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        student = serializer.save()
        refresh = RefreshToken.for_user(student)
        return Response({
            "prof": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
#@permission_classes([IsAdminUser])
def student_semester_maxmin_units(request):

    student_code = request.data.get("student_code")
    semester_code = request.data.get("semester_code")

    if not student_code or not semester_code:
        return Response(
            {"error": "student_code and semester_code are required"},
            status=400
        )

    try:
        ss = StudentSemester.objects.select_related(
            'student', 'semester'
        ).get(
            student__student_code=student_code,
            semester__code=semester_code
        )
    except StudentSemester.DoesNotExist:
        return Response(
            {"error": "StudentSemester not found"},
            status=404
        )

    serializer = StudentSemesterUnitsSerializer(
        ss, data=request.data, partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
