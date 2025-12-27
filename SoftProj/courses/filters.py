# courses/filters.py
import django_filters as filters
from .models import CourseOffering
from django.db.models import Q

class CourseOfferingFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_by_all')

    class Meta:
        model = CourseOffering
        fields = []
    
    def filter_by_all(self, queryset, name, value):
        return queryset.filter(
            Q(course__name__icontains=value) |
            Q(course__code__icontains=value) |
            Q(prof__first_name__icontains=value) |
            Q(prof__last_name__icontains=value)
        )
    