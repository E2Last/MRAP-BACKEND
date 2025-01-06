from django.contrib import admin
from .models import Tipo_elemento
# Register your models here.
@admin.register(Tipo_elemento)
class Tipo_elemento_admin(admin.ModelAdmin):
    fields_list = ['id','nombre_tipo_de_elemento',]
    list_display = ['id','nombre_tipo_de_elemento',]
    
"""
        'bateria',
        'bomba',
        'cisterna',        
        'copa',
        'pozo',
        'punto_interno',
"""