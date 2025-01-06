from django.contrib import admin
from .models import Estado
# Register your models here.
@admin.register(Estado)
class Bomba_usos_admin(admin.ModelAdmin):
    fields_list=['id','descripcion']
    list_display=['id','descripcion']