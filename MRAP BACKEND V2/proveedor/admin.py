from django.contrib import admin
from .models import Proveedor
# Register your models here.
@admin.register(Proveedor)
class Proveedor_admin(admin.ModelAdmin):
    fields_list=['id','codigo_proveedor','nombre_proveedor']
    
    list_display=['id','codigo_proveedor','nombre_proveedor']