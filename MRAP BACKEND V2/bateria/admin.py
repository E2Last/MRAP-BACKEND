from django.contrib import admin
from .models import Bateria
# Register your models here.
@admin.register(Bateria)
class Bateria_admin(admin.ModelAdmin):
    fields_list=['id','nombre_bateria','latitud','longitud']
    list_display=['id','nombre_bateria','latitud','longitud','caudal_total']