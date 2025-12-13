from django.contrib import admin
from .models import Semester


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('code', 'year', 'term', 'is_active')
    list_filter = ('year', 'term', 'is_active')
    search_fields = ('code',)
    ordering = ('-year', 'term')
    readonly_fields = ('code',)  

"""
@admin.register(StudentSemester)
class StudentSemesterAdmin(admin.ModelAdmin):
    list_display = ('student', 'semester', 'total_units', 'status', 'min_units', 'max_units')
    list_filter = ('semester', 'status')
    search_fields = ('student__user__username', 'semester__code')
    ordering = ('semester', 'student')
"""