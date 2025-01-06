from django.contrib import admin
from .models import Copa
# Register your models here.
@admin.register(Copa)
class Copa_admin(admin.ModelAdmin):
    fields_list=['id','nombre_copa','latitud','longitud','estado','localidad']
    list_display=['id','nombre_copa','latitud','longitud','estado','localidad']