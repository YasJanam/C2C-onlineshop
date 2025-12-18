from django.contrib import admin
from .models import Semester, StudentSemester#, StudentCourse
from courses.models import CourseOffering
from django.contrib.auth.models import User


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('code', 'year', 'term', 'is_active')
    list_filter = ('year', 'term', 'is_active')
    search_fields = ('code',)
    readonly_fields = ('code',)


@admin.register(StudentSemester)
class StudentSemesterAdmin(admin.ModelAdmin):
    list_display = ('student', 'semester', 'total_units', 'min_units', 'max_units')
    list_filter = ('semester',)
    search_fields = ('student__username', 'student__first_name', 'student__last_name')

"""  
@admin.register(StudentCourse)
class StudentCourseAdmin(admin.ModelAdmin):
    list_display = ('student_semester', 'course_offering', 'grade', 'status')
    list_filter = ('status', 'course_offering__course')
    search_fields = (
        'student_semester__student__username',
        'student_semester__student__first_name',
        'student_semester__student__last_name',
        'course_offering__course__code',
        'course_offering__course__name'
    )
"""