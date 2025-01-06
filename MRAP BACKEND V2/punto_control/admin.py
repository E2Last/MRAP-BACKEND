from django.contrib import admin
from .models import Punto_de_control
# Register your models here.
@admin.register(Punto_de_control)
class Punto_de_control_admin(admin.ModelAdmin):
    fields_list=[
        'id',
        'pozo',
        'copa',
        'cisterna',
        'bateria',
        'bomba',
        'punto_interno',
        'intervalo_referencia',
        'estado',
        'nombre_punto_de_control',
        'estado_retrasos'
    ]
    list_display = [
        'id',
        'estado',
        'nombre_punto_de_control',
        'estado_retrasos',
        'punto_interno'
    ]
    