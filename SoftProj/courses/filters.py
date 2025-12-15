# courses/filters.py
import django_filters as filters
from .models import CourseOffering

class CourseOfferingFilter(filters.FilterSet):
    course_code = filters.CharFilter(
        field_name='course__code',
        lookup_expr='exact'
    )

    course_title = filters.CharFilter(
        field_name='course__name',
        lookup_expr='icontains'
    )

    professor_first_name = filters.CharFilter(
        field_name='professor__first_name',
        lookup_expr='icontains'
    )

    professor_last_name = filters.CharFilter(
        field_name='professor__last_name',
        lookup_expr='icontains'
    )


    min_capacity = filters.NumberFilter(
        field_name='capacity',
        lookup_expr='gte'
    )

    session_day = filters.CharFilter(
        field_name='sessions__day',
        lookup_expr='exact'
    )

    class Meta:
        model = CourseOffering
        fields = []
