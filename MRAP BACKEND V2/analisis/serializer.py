from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from rest_framework import serializers
from .models import Unidad
from .models import Parametro
from .models import Periodicidad
from .models import Intervalo_referencia
from .models import Periodo_analisis_elemento
from analisis.models import Analisis
from tipo_elemento.models import Tipo_elemento
from tipo_elemento.serializer import Tipo_elemento_serializer
from control.models import Tipo_control

####################### UNIDAD #######################
class Unidad_serializer(ModelSerializer):
    class Meta:
        model = Unidad
        fields = ['id','codigo','nombre_unidad']

####################### PARAMETRO #######################
class Parametro_post_serializer(ModelSerializer):
    unidad = PrimaryKeyRelatedField( queryset=Unidad.objects.all(), many=False )
    analisis = PrimaryKeyRelatedField( queryset=Analisis.objects.all(), many=False )
    class Meta:
        model = Parametro
        fields = ['id','parametro_codigo','nombre_parametro','unidad','texto','numero','decimales','analisis']
        
class Parametro_get_serializer(ModelSerializer):
    unidad = Unidad_serializer()
    
    class Meta:
        model = Parametro
        fields = ['id','parametro_codigo','nombre_parametro','unidad','texto','numero','decimales']
        
####################### PERIODICIDAD #######################
class Periodicidad_serializer(ModelSerializer):
    class Meta:
        model = Periodicidad
        fields = ['id','periodicidad_codigo','periodicidad_nombre','numero_dias','retraso_dias','muy_retrasado_dias']
        
####################### INTERVALO DE REFERENCIA #######################
class Intervalo_referencia_get_serializer(ModelSerializer):
    tipo_elemento = Tipo_elemento_serializer()
    parametro = Parametro_get_serializer()
    # unidad = Unidad_serializer()
    
    class Meta:
        model = Intervalo_referencia
        fields = [
            'id',
            'tipo_elemento' ,
            'parametro',
            # 'unidad',
            'muy_bajo',
            'bajo',
            'alto',
            'muy_alto',
            'muy_bajo_regex',
            'bajo_regex',
            'alto_regex',
            'muy_alto_regex',
        ]
        
class Intervalo_referencia_post_serializer(ModelSerializer):
    tipo_elemento = PrimaryKeyRelatedField(queryset=Tipo_elemento.objects.all(), many=False)
    parametro = PrimaryKeyRelatedField(queryset=Parametro.objects.all(), allow_null=True, required=False)
    # unidad = PrimaryKeyRelatedField(queryset=Unidad.objects.all(), allow_null=True, required=False)
    
    class Meta:
        model = Intervalo_referencia
        fields = [
            'id',
            'tipo_elemento' ,
            'parametro',
            # 'unidad',
            'muy_bajo',
            'bajo',
            'alto',
            'muy_alto',
            'muy_bajo_regex',
            'bajo_regex',
            'alto_regex',
            'muy_alto_regex',
        ]

####################### ANALISIS #######################
class TipoControl_serializer(ModelSerializer):
    class Meta:
        model = Tipo_control
        fields = [
            'id','tipo_control'
        ]

class Analisis_get_serializer(ModelSerializer):
    tipo_control = TipoControl_serializer()
    
    class Meta:
        model = Analisis
        fields = ['id','nombre','parametros','tipo_control']

class Analisis_post_serializer(ModelSerializer):
    parametros = PrimaryKeyRelatedField( queryset = Parametro.objects.all(), many = True )
    
    class Meta:
        model = Analisis
        fields = ['id','nombre','parametros','tipo_control']
        
class Analisis_parametro_serializer(ModelSerializer):
    class Meta:
        model = Analisis.parametros.through
        fields = '__all__'

####################### PERIODO ANALISIS ELEMENTO #######################        
class Periodo_analisis_elemento_get_serializer(ModelSerializer):
    tipo_elemento = Tipo_elemento_serializer()
    analisis = Analisis_get_serializer()
    periodo = Periodicidad_serializer()
    
    class Meta:
        model = Periodo_analisis_elemento
        fields = ['id','tipo_elemento','analisis','periodo']
    

class Periodo_analisis_elemento_post_serializer(ModelSerializer):
    tipo_elemento = PrimaryKeyRelatedField(queryset=Tipo_elemento.objects.all(), many=False)
    analisis = PrimaryKeyRelatedField(queryset = Analisis.objects.all(), many=False)
    periodo = PrimaryKeyRelatedField(queryset = Periodicidad.objects.all(), many=False)
    class Meta:
        model = Periodo_analisis_elemento
        fields = ['id','tipo_elemento','analisis','periodo']
        
####################### CONTROL #######################
# class Control_get_serializer(ModelSerializer):
#     usuario = Usuario_serializer()
#     punto_de_control = Punto_de_control_serializer()
#     analisis = Analisis_get_serializer()
#     proveedor = Proveedor_serializer()
#     class Meta:
#         model = Control
#         fields = [
#             'id',
#             'aprobado',
#             'advertencia',
#             'usuario',
#             'punto_de_control',
#             'analisis',
#             'resultado',
#             'archivo',
#             'proveedor',
#         ]
        
# class Control_post_serializer(ModelSerializer):
#     usuario = PrimaryKeyRelatedField(queryset=Usuario.objects.all(), many=False)
#     punto_de_control = PrimaryKeyRelatedField(queryset=Punto_de_control.objects.all(), many=False)
#     analisis = PrimaryKeyRelatedField(queryset=Analisis.objects.all(), many=False)
#     proveedor = PrimaryKeyRelatedField(queryset=Proveedor.objects.all(), many=False)
#     class Meta:
#         model = Control
#         fields = [
#             'id',
#             'aprobado',
#             'advertencia',
#             'usuario',
#             'punto_de_control',
#             'analisis',
#             'resultado',
#             'archivo',
#             'proveedor',
#         ]