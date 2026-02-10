
from django.db import models
from django.contrib.auth.models import User
#from pgvector.django import VectorField




class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self',null=True,blank=True,on_delete=models.CASCADE,related_name='children')

    def __str__(self):
        return self.name
      
    

class Product(models.Model):
    product_owner = models.ForeignKey(User, on_delete=models.CASCADE,related_name='products')
    name = models.CharField(max_length=200,verbose_name="name")
    description = models.TextField(null=True,blank=True)
    price = models.PositiveIntegerField(verbose_name="price",default=0)
    stock = models.PositiveIntegerField(default=1)
    buyed_num = models.IntegerField(default=0)
    is_active = models.BooleanField(null=True,blank=True,default=True)

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}({self.product_owner.first_name} {self.product_owner.last_name})"
    
    class Meta:
        verbose_name = "product"
    
  

class ProductImage(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='images')
    #image = models.ImageField(upload_to='products/',null=True,blank=True)
    image = models.URLField()
    #image_embeding = models.JSONField(null=True,blank=True,help_text="image embedding vector, used for visual search")
    """
    image_embedding = VectorField(
        dimensions=512,
        null=True,
        blank=True,
        help_text="CLIP image embedding"
    )
    """



class ProductCategory(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="categories")
    category = models.ForeignKey(Category,on_delete=models.CASCADE)



