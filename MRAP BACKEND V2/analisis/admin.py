from django.contrib import admin
from .models import Analisis
from .models import Intervalo_referencia
from .models import Parametro
from .models import Unidad
from .models import Periodicidad
from .models import Periodo_analisis_elemento
# from .models import Control

@admin.register(Analisis)
class Analisis_admin(admin.ModelAdmin):
    fields_list = ['id','nombre',]
    list_display = ['id','nombre',]
    
@admin.register(Intervalo_referencia)
class Intervalo_referencia_admin(admin.ModelAdmin):
    list_display= [
        'id',
        'tipo_elemento',
        'parametro',
        # 'unidad',
        'muy_bajo',
        'bajo',
        'alto',
        'muy_alto',
        # 'muy_bajo_regex',
        # 'bajo_regex',
        # 'alto_regex',
        # 'muy_alto_regex',
    ]

@admin.register(Parametro)
class Parametro_admin(admin.ModelAdmin):
    fields_list = [
        'id',
        'parametro_codigo',
        'nombre_parametro',
        'unidad',
        'texto',
        'numero',
        'decimales'
    ]
    list_display = [
        'id',
        'parametro_codigo',
        'nombre_parametro',
        'unidad',
        'texto',
        'numero',
        'decimales'
    ]
    
@admin.register(Unidad)
class Unidad_admin(admin.ModelAdmin):
    fields_list = [
        'id',
        'codigo',
        'nombre_unidad',
    ]
    list_display = [
        'id',
        'codigo',
        'nombre_unidad',
    ]
    
@admin.register(Periodicidad)
class Periodicidad_admin(admin.ModelAdmin):
    fields_list = [
        'id',
        'periodicidad_codigo',
        'periodicidad_nombre',
        'numero_dias',
        'retraso_dias',
        'muy_retrasado_dias'
    ]
    list_display = [
        'id',
        'periodicidad_codigo',
        'periodicidad_nombre',
        'numero_dias',
        'retraso_dias',
        'muy_retrasado_dias'
    ]

@admin.register(Periodo_analisis_elemento)
class Periodo_analisis_elemento_admin(admin.ModelAdmin):
    """
    fields_list = [
        'id',
        'pozo',
        'cisterna',
        'bateria',
        'bomba',
        'punto_interno',
        'analisis',
        'periodo'
    ]
    """
    fields_list = ['id','tipo_elemento','analisis','periodo']
    list_display= ['id','tipo_elemento','analisis','periodo']
