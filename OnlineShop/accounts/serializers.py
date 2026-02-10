
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name','username','email']

    """
    def create(self, validated_data):
        username = validated_data.get('username')

        all_usernames = [user.username for user in User.objects.all()]
        if username in all_usernames:
            raise serializers.ValidationError("خطا، نام کاربری تکراری است")
        validated_data['groups'] = ['user']
        return super().create(validated_data)
    """



class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user',
            'phone_number',
            'address',
            'post_code',
        ]