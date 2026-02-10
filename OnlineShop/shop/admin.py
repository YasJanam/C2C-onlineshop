
from django.contrib import admin
from .models import *


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    # فیلدهایی که در لیست نمایش داده می‌شوند
    list_display = ('user', 'updated_at')
    
    # امکان جستجو در این فیلدها
    search_fields = ('user__username',)
    
    # امکان فیلتر کردن بر اساس این فیلدها
    list_filter = ('user',)

    # فیلدهایی که در فرم افزودن/ویرایش ظاهر می‌شوند
    fields = ('user',)  


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product','quantity')
    
    search_fields = ('cart__user__username','product__name','product__product_owner__username')
    
    list_filter = ('cart','product',)

    fields = ('cart','product','quantity')  


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = ('buyer','created_at','total_price')
    search_fields = ('buyer__username',)
    list_filter = ('buyer',)
    fields = ('buyer','total_price',)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('product','order',
                  'quantity','price')
    
    search_fields = ('product__name','product__description','product__product_owner__first_name',
                     'product__product_owner__last_name',
                  'quantity','price')
    
    list_filter = ('product','order','quantity','price',)
    
    fields = ('product','order','quantity','price')
    


