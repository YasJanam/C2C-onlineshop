from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
from .serializers import *
from courses.serializers import CourseOfferingReadSerializer 
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from .filters import *






class StudentSemesterViewSet(ModelViewSet):
    queryset = StudentSemester.objects.all()
    serializer_class = StudentSemesterSerializer 
    permission_classes = [IsAuthenticated] 
    #filter_backends = [DjangoFilterBackend]
    #filterset_class = StudentSemesterFilter

    # max-min student-units
    @action(detail=False, methods=['patch'], url_path='maxmin-units') 
    def update_units(self, request):
      
        student_code = request.data.get("student_username")
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
                student__username=student_code,
                semester__code=semester_code
            )
        except StudentSemester.DoesNotExist:
            return Response(
                {"error": "StudentSemester not found"},
                status=404
            )

        serializer = StudentSemesterUnitsSerializer(ss, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    

    @action(detail=False, methods=['get'], url_path='courses-in-semester')
    def courses_in_semester(self, request):
        """
        جست و جوی دروس ارائه شده در یک ترم توسط کد ترم
        ?semester_code=20251
        """
        semester_code = request.query_params.get('semester_code')
        if not semester_code:
            return Response({"error": "semester_code is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            semester = Semester.objects.get(code=semester_code)
        except Semester.DoesNotExist:
            return Response({"error": "Semester not found"}, status=status.HTTP_404_NOT_FOUND)

        offerings = CourseOffering.objects.filter(semester=semester.code)
        serializer = CourseOfferingReadSerializer(offerings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class StudentCourseViewSet(ModelViewSet):
    queryset = StudentCourse.objects.all() #filter(student_semester__is_active=True)
    serializer_class = StudentCourseSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user

        if user.groups.filter(name='student').exists():
            return StudentCourse.objects.filter(
                student_semester__is_active=True,
                student_semester__student=self.request.user
            )

        if user.groups.filter(name='prof').exists():
            return StudentCourse.objects.filter(
                student_semester__is_active=True,
                course_offering__prof=user
            ).select_related('course_offering', 'student_semester__student')
        
        else:
            return StudentCourse.objects.all()

    
    @action(detail=False, methods=['post'], url_path='enroll')
    def enroll(self, request):
        serializer = EnrollCourseSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        student_course = serializer.save()
        return Response(StudentCourseSerializer(student_course).data, status=201)
    

    # =======================
    # Action برای گرفتن لیست دانشجویان یک درس
    # =======================
    @action(detail=True, methods=['get'], url_path='students')
    def students(self, request, pk=None):
        user = request.user

        if not user.groups.filter(name='prof').exists():
            return Response({"detail": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        # گرفتن همه دانشجویان درس مشخص
        students = StudentCourse.objects.filter(
            course_offering_id=pk,
            course_offering__prof=user
        ).select_related('student_semester__student')

        # ساخت خروجی خوانا
        student_list = [
            {
                "id": s.student_semester.student.id,
                "full_name": f"{s.student_semester.student.first_name} {s.student_semester.student.last_name}"
            }
            for s in students
        ]

        return Response(student_list, status=status.HTTP_200_OK)

    
    # =======================
    # حذف دانشجو از درس
    # =======================
    @action(detail=True, methods=['delete'], url_path='students/(?P<student_id>[^/.]+)')
    def remove_student(self, request, pk=None, student_id=None):
        user = request.user

        if not user.groups.filter(name='prof').exists():
            return Response({"detail": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        try:
            # پیدا کردن StudentCourse مربوط به آن درس و دانشجو
            student_course = StudentCourse.objects.get(
                course_offering_id=pk,
                course_offering__prof=user,
                student_semester__student__id=student_id,
            )
        except StudentCourse.DoesNotExist:
            return Response({"detail": "دانشجو در این درس وجود ندارد"}, status=404)

        student_course.delete()
        return Response({"detail": "دانشجو حذف شد"}, status=204)
