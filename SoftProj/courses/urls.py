# courses/urls.py
from django.urls import path
#from .api_views import *
#from .prerequisites_management import *
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter
router.register(r'courses',views.CourseViewSet)
router.register(r'course-offering',views.CourseOfferingViewSet)
router.register(r'sessions',views.SessionViewSet)



urlpatterns = [

    # search courses by name and prof-name and semester
    #path('api/courses-offering/search/', search_courses, name='search_courses'),

    # search courses by semester
    #path('api/courses-offering/semester/', offered_courses_by_semester, name='offered_courses_by_semester'),

]