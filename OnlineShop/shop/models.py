from django.db import models
from django.contrib.auth.models import User
from product.models import Product



class Cart(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    total_price = models.DecimalField(max_digits=10,decimal_places=2,default=0)

    def update_total_price(self):
        total = sum(item.product.price * item.quantity for item in self.items.all())
        self.total_price = total
        self.save()

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"
    

    def __str__(self):
        return f"{self.user.username}"



class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart','product')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.cart.update_total_price()

    def __str__(self):
        return f"{self.product} x {self.quantity}"
    




class Order(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price =  models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    #authority = models.CharField(max_length=255,blank=True,null=True)

    def update_total_price(self):
        total = sum(item.price * item.quantity for item in self.items.all())
        self.total_price = total
        self.save()



class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE, related_name='items')
    """
    product_name = models.CharField(max_length=200)
    product_owner = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True)
    product_description = models.TextField(null=True,blank=True)
    """
    product = models.ForeignKey(Product,on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10,decimal_places=2)

    class Meta:
        verbose_name = 'OrderItem'

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    


