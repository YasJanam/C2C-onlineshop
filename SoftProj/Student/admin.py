from django.contrib import admin
from .models import *


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'student_code', 'first_name', 'last_name', 'major', 'entry_year', 'gender')
    search_fields = ('user__username', 'student_code', 'first_name', 'last_name')
    list_filter = ('major', 'gender', 'entry_year')
    ordering = ('student_code',)


@admin.register(StudentCourse)
class StudentCourseAdmin(admin.ModelAdmin):
    list_display = ('student_semester', 'course_offering', 'grade', 'status')
    search_fields = ('student_semester__student__user__username', 'course_offering__course__name', 'course_offering__offering_code')
    list_filter = ('status', 'course_offering__semester')
    ordering = ('student_semester', 'course_offering')


@admin.register(StudentSemester)
class StudentSemesterAdmin(admin.ModelAdmin):
    list_display = ('student', 'semester', 'total_units', 'status', 'min_units', 'max_units')
    list_filter = ('semester', 'status')
    search_fields = ('student__user__username', 'semester__code')
    ordering = ('semester', 'student')