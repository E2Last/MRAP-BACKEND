from django.contrib import admin
from control.models import Control
from control.models import Tipo_control
from control.models import Valores_control
# from control.models import Control_fisico_quimico
# from control.models import Control_diario
# from control.models import Control_bacteriologico
# from control.models import Parametro_control_fisico_quimico
# from control.models import Parametro_control_diario
# from control.models import Parametro_control_bacteriologico

# Register your models here.
@admin.register(Control)
class Control_admin(admin.ModelAdmin):
    list_display = [
            'id',
            'usuario',
            'fecha',
            'hora',
            'punto_de_control',
            'proveedor',
            'analisis',
            'tipo_control',
            'aprobado'
        ]

@admin.register(Tipo_control)
class Tipo_control_admin(admin.ModelAdmin):
    list_display = [
        'id','tipo_control'
    ]
    
@admin.register(Valores_control)
class Valores_control_admin(admin.ModelAdmin):
    list_display = [
        'id','control','fecha','hora','analisis','tipo_control','parametro','valor'
    ]

# @admin.register(Control_fisico_quimico)
# class Control_fisico_quimico_admin(admin.ModelAdmin):
#     list_display = [
#         'id','punto_de_control'
#     ]

# @admin.register(Control_diario)
# class Control_diario_admin(admin.ModelAdmin):
#     list_display = [
#         'id','punto_de_control'
#     ]
    
# @admin.register(Control_bacteriologico)
# class Control_bacteriologico_admin(admin.ModelAdmin):
#     list_display = [
#         'id','punto_de_control'
#     ]

# @admin.register(Parametro_control_fisico_quimico)
# class Parametro_control_fisico_quimico_admin(admin.ModelAdmin):
#     list_display = [
#         'parametro','analisis','valor'
#     ]
    
# @admin.register(Parametro_control_diario)
# class Parametro_control_diario_admin(admin.ModelAdmin):
#     list_display = [
#         'parametro','analisis','valor'
#     ]
    
# @admin.register(Parametro_control_bacteriologico)
# class Parametro_control_bacteriologico_admin(admin.ModelAdmin):
#     list_display = [
#         'control','parametro','analisis','valor'
#     ]