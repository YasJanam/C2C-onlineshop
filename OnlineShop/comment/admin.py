from django.contrib import admin
from .models import Comment
# Register your models here.

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user','product', 'comment','star','is_deleted','created_at',
                    'updated_at',)
    
    search_fields = ('product__name','product__description','user__first_name',
                     'user__last_name', 'comment','star','is_deleted',
                     'created_at','updated_at',)
    
    list_filter = ('product','user','comment','star','is_deleted','created_at',
                   'updated_at',)
    
    fields = ('product','user','comment','star','is_deleted','created_at',
              'updated_at',)
