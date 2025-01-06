from django.contrib import admin
from .models import Punto_interno
# Register your models here.
@admin.register(Punto_interno)
class Punto_interno_admin(admin.ModelAdmin):
    fields_list=['id','estado','nombre','latitud','longitud']