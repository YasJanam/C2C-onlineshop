from django.contrib import admin
from .models import *
from django.utils.html import format_html


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # فیلدهایی که در لیست نمایش داده می‌شوند
    list_display = ('name', 'product_owner', 'price',#'category',
                    'stock','is_active','created_at','updated_at',
                    'buyed_num',)
    
    # امکان جستجو در این فیلدها
    search_fields = ('name', 'product_owner__username','product_owner__first_name',
                     'product_owner__last_name','created_at', #'category__name',
                     'price','is_active',)
    
    # امکان فیلتر کردن بر اساس این فیلدها
    list_filter = ('product_owner','name','price','stock','is_active', #'category'
                   'buyed_num',)

    # فیلدهایی که در فرم افزودن/ویرایش ظاهر می‌شوند
    fields = ('product_owner', 'name', 'description', 'price','stock', # 'category',
              'is_active','buyed_num',)  
    
    readonly_fields = ('created_at','updated_at')



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name','parent')
    search_fields = ('name','parent__name',)
    list_filter = ('name','parent')
    fields = ('name','parent')


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('product','category')
    search_fields = ('product__name','product__product_owner',
                     'category__name',)
    list_filter = ('product','category')
    fields = ('product','category')




@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product',)
    
    search_fields = ('product__name','product__product_owner__first_name',
                     'product__product_owner__last_name',
                     'product__product_owner__username',)
    
    list_filter = ('product',)
    fields = ('product','image','image_embedding')

    #readonly_fields = ('image_embedding',)
    """    
    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" />', obj.image.url)
        return "-"
    image_tag.short_description = 'Image'
    """
