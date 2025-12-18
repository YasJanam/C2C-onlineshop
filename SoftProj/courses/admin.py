from django.contrib import admin
from .models import Course, Session, CourseOffering


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'unit')
    search_fields = ('code', 'name')
    ordering = ('code',)
    filter_horizontal = ('prerequisites',)


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('day_of_week', 'time_slot', 'location')
    list_filter = ('day_of_week', 'time_slot')
    search_fields = ('location',)


@admin.register(CourseOffering)
class CourseOfferingAdmin(admin.ModelAdmin):
    list_display = ('course', 'prof_name', 'semester', 'group_code', 'capacity')
    list_filter = ('semester', 'course')
    search_fields = ('course__name', 'course__code', 'prof_name')
    filter_horizontal = ('sessions',)
    readonly_fields = ('code',)
