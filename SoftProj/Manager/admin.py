from django.contrib import admin
from .models import Manager


@admin.register(Manager)
class ProfessorAdmin(admin.ModelAdmin):
    
    list_display = ['manager_code', 'first_name', 'last_name']
    search_fields = ['manager_code', 'first_name', 'last_name']
    fields = ['first_name', 'last_name', 'manager_code']