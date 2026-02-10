from django.db import models
from django.contrib.auth.models import User
from product.models import Product
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.


class Comment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='comments')
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='comments')
    comment = models.TextField(null=True,blank=True)
    star = models.PositiveIntegerField(validators=[
        MinValueValidator(0),
        MaxValueValidator(5),
    ],)
    is_deleted = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Comment'
