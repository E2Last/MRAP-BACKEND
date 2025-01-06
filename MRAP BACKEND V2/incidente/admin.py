from django.contrib import admin
from django.contrib.admin import ModelAdmin
# from .models import Estado_incidente
from .models import Gravedad_incidente
from .models import Tipo_incidente
from .models import Incidente
from .models import Operacion
from .models import Incidente_operacion



#@admin.register(Estado_incidente)
#class Estado_incidente_admin(ModelAdmin):
#   fields_list = [
#        'id',
#        'descripcion',
#    ]
#    
#    list_display = (
#        'id',
#        'descripcion',
#    )
 
@admin.register(Gravedad_incidente)
class Gravedad_incidente_admin(ModelAdmin):
    fields_list = [
        'id',
        'descripcion',
    ]
    
    list_display = (
        'id',
        'descripcion',
    )
    
@admin.register(Tipo_incidente)
class Tipo_incidente_admin(ModelAdmin):
    list_display = (
        'id',
        'descripcion_tipo_incidente',
        'inhabilitar_elemento'
    )
    
@admin.register(Incidente)
class Incidente_admin(ModelAdmin):
    fields_list = [
        'id',
        'titulo',
        'estado_incidente',
        'gravedad'
        #'punto_de_control',
        'fecha_incidente',
        'fecha_de_registro',
        'tipo_incidente',
        'usuario',
        'descripcion',
    ]
    
    list_display = (
        'id',
        'titulo',
        'estado_incidente',
        #'punto_de_control',
        'fecha_incidente',
        'fecha_de_registro',
        'usuario',
        'descripcion',
    )

@admin.register(Operacion)
class Operacion_admin(ModelAdmin):
    fields_list = ['id', 'descripcion_operacion']
    list_display = ('id', 'descripcion_operacion',)
    
@admin.register(Incidente_operacion)
class Incidente_operacion(ModelAdmin):
    fields_list = [
        'id',
        'incidente',
        'operacion',
        'usuario',
        'fecha',
    ]
    list_display = (
        'id',
        'incidente',
        'operacion',
        'usuario',
        'fecha',
    )