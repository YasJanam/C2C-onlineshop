from django.contrib import admin
from .models import *

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user','phone_number','address','post_code',)
    search_fields = ('user__first_name','user__last_name','user__email',
                     'user__username','phone_number',
                     'address','post_code',)
    list_filter = ('user','phone_number','address','post_code',)
    fields = ('user','phone_number','address','post_code',)  