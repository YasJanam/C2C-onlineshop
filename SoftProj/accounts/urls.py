# accounts/urls.py
from django.urls import path
from .api import *

urlpatterns = [ 
     path('login/', login_api, name='login'),
     path('logout/',logout_api,name='logout'),
]
