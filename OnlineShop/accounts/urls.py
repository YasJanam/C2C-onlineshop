
from django.urls import path , include
from .apis import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r'users',UserViweSet,basename='users')
router.register(r'admins',AdminViweSet,basename='admins')

#router.register(r'userprofile',UserProfileViewSet,basename='userProfile')
router.register(r'userprofiles',UserProfilesViewSet,basename='userprofiles')


urlpatterns = [
    path('',include(router.urls)),

    path('user-role/',UserRoleAPIView.as_view()),
    path('user/admin/',UserAPIView.as_view()), 
    
    path('api/token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('api/token/refresh',TokenRefreshView.as_view(),name='token_refresh'),
    
    path('create-user/',CreateUserAPIView.as_view()),
    path('user-profile/<int:user_id>/',UserProfileAPIView.as_view()),
    path('myprofile/',MyProfileAPIView.as_view()),
    
]