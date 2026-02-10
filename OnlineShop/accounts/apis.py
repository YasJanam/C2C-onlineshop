
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer , UserProfileSerializer
from django.contrib.auth.models import Group
from django.db import IntegrityError
from .models import *

class UserRoleAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self,request):
        user = request.user
        groups = list(user.groups.values_list('name',flat=True))
        role = groups[0] if groups else None
        return Response({
            'id':user.id,
            'username':user.username,
            'role':role
        })
    
# used by admin
class UserAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self,request):
        fname = request.data.get('first_name')
        lname = request.data.get('last_name')
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        group = request.data.get('group')

        try:
            user = User.objects.create_user(
                username=username,
                password=password,
            )
        except IntegrityError:
            return Response(
                {"error": "نام کاربری تکراری است"},
                status=400
            )

        #user.groups.add(group)
        if group:
            try:
                group_obj = Group.objects.get(name=group)
                user.groups.add(group_obj)
            except Group.DoesNotExist:
                return Response({"error":"group does not exist"},status=400)

        if fname:
            user.first_name = fname
        if lname:
            user.last_name = lname
        if email:
            user.email = email

        serializer = UserSerializer(user)
        return Response(serializer.data,status=200)

    def patch(self,request):
        fname = request.data.get('first_name')
        lname = request.data.get('last_name')
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        group = request.data.get('group')
        
        user = User.objects.get(username = username)

        if password:
            user.set_password(password)
        
        user_group = user.groups.first()
        
        if group :
            if group != user_group.name:
                try:
                    group_obj = Group.objects.get(name=group)
                    user.groups.remove(user_group)
                    user.groups.add(group_obj)
                except Group.DoesNotExist:
                    return Response({"error":"group does not exist"},status=400)
        """
        else :
            try:
                group_obj = Group.objects.get(name=group)
                user.groups.add(group_obj)
            except Group.DoesNotExist:
                return Response({"error":"group does not exist"},status=400)   
        """         

        if fname:
            user.first_name = fname
        if lname:
            user.last_name = lname
        if email:
            user.email = email

        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data,status=200)
    


class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self,request,user_id):
        prof = UserProfile.objects.get(user__id = user_id)
        data = UserProfileSerializer(prof)
        return Response(data.data)
    



class MyProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]   

    def get(self,request):
        user = self.request.user
        prof = UserProfile.objects.get(user=user)
        data = UserProfileSerializer(prof)
        return Response(data.data)  


    def patch(self,request):
        user = self.request.user
        prof = UserProfile.objects.get(user=user)
        prof.phone_number = request.data.get('phone_number')
        prof.address = request.data.get('address')
        prof.post_code = request.data.get('post_code')
        req_user = request.data.get('user')



        main_user = prof.user
        main_user.first_name = req_user['first_name']
        main_user.last_name = req_user['last_name']
        main_user.email = req_user['email']
        prof.save()
        main_user.save()
        
        serializer = UserProfileSerializer(prof)
        return Response(serializer.data)
    

class CreateUserAPIView(APIView):
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')
       
        try:
            user = User.objects.create_user(
                username=username,
                password=password,
            )
        except IntegrityError:
            return Response(
                {"error": "نام کاربری تکراری است"},
                status=400
            )

        #user.groups.add(group)
   
        group_obj = Group.objects.get(name='user')
        user.groups.add(group_obj)
        
        serializer = UserSerializer(user)
        return Response(serializer.data,status=200)