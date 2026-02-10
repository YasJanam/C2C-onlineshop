from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="profile")
    phone_number = models.CharField(max_length=11,null=True,blank=True)
    post_code = models.CharField(max_length=20,null=True,blank=True)
    address = models.TextField(null=True,blank=True)

    class Meta:
        verbose_name = 'user-profile'

    def __str__(self):
         return f"{self.user.first_name} - {self.user.last_name}"