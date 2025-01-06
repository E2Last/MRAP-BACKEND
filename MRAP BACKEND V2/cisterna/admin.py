from django.contrib import admin
from .models import Cisterna
# Register your models here.
@admin.register(Cisterna)
class Cisterna_admin(admin.ModelAdmin):
    fields_list=['id','nombre_cisterna','latitud','longitud','estado']