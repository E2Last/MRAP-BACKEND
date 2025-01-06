from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, IntegerField, SlugRelatedField, SerializerMethodField
from .models import Incidente_operacion
from .models import Incidente
from .models import Operacion
from .models import Gravedad_incidente
from .models import Tipo_incidente
from .models import Incidente
from estado.models import Estado
from bomba.models import Bomba
from tipo_elemento.models import Tipo_elemento
from usuario.models import Usuario
from usuario.serializer import Usuario_public_info
from punto_control.models import Punto_de_control
from punto_control.serializer import Punto_de_control_serializer
from pozo.serializer import Pozo_serializer
# from pozo.serializer import Pozo_short_info
from copa.serializer import Copa_serializer
from cisterna.serializer import Cisterna_serializer
from bateria.serializer import Bateria_serializer
from bomba.serializer import Bomba_serializer
from punto_interno.serializer import Punto_interno_serializer
from tipo_elemento.serializer import Tipo_elemento_serializer

################## GRAVEDAD INCIDENTE ##################
class Gravedad_incidente_serializer(ModelSerializer):
    class Meta:
        model = Gravedad_incidente
        fields = ['id','descripcion']
        
################## TIPO INCIDENTE ##################
class Tipo_incidente_serializer(ModelSerializer):
    class Meta:
        model = Tipo_incidente
        fields = ['id','descripcion_tipo_incidente','inhabilitar_elemento']

################## OPERACION ##################
class Operacion_serializer(ModelSerializer):
    class Meta:
        model = Operacion
        fields = ['id','descripcion_operacion']

################## INCIDENTE OPERACION ################## 
class Incidente_operacion_serializer(ModelSerializer):
    operacion = Operacion_serializer()
    usuario = Usuario_public_info()
    
    class Meta:
        model = Incidente_operacion
        fields = ['incidente','operacion','usuario','fecha']

class Incidente_operacion_post_serializer(ModelSerializer):
    incidente = PrimaryKeyRelatedField( queryset = Incidente.objects.all(), many=False )
    operacion = PrimaryKeyRelatedField( queryset = Operacion.objects.all(), many=False )
    usuario = PrimaryKeyRelatedField( queryset =  Usuario.objects.all(), many=False)
    
    class Meta:
        model = Incidente_operacion
        fields = ['incidente','operacion','usuario','fecha']
        
################## INCIDENTE ################## 
class Punto_de_control_incidente_serializer(ModelSerializer):
    class Meta:
        model = Punto_de_control
        fields = ['id','nombre_punto_de_control']
"""   
class Incidente_get_serializer(ModelSerializer):
    estado_incidente = Operacion_serializer()
    gravedad = Gravedad_incidente_serializer()
    tipo_incidente = Tipo_incidente_serializer()
    #punto_de_control = Punto_de_control_incidente_serializer()
    usuario = Usuario_serializer()
    pozo = Pozo_serializer()
    copa = Copa_serializer()
    cisterna = Cisterna_serializer()
    bateria = Bateria_serializer()
    bomba = Bomba_serializer()
    punto_interno = Punto_interno_serializer()
    
    class Meta:
        model = Incidente
        fields = [
            'id',
            'titulo',
            'estado_incidente',
            'gravedad',
            #'punto_de_control',
            'pozo',
            'copa',
            'cisterna',
            'bateria',
            'bomba',
            'punto_interno',
            'fecha_incidente',
            'fecha_de_registro',
            'tipo_incidente',
            'usuario',
            'descripcion',    
        ]
"""

class ElementoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre_elemento = serializers.CharField()
    tipo_elemento = serializers.CharField()

class Incidente_get_serializer(ModelSerializer):
    tipo_incidente = Tipo_incidente_serializer()
    estado_incidente = Operacion_serializer()
    gravedad = Gravedad_incidente_serializer()
    usuario = Usuario_public_info()
    elemento = ElementoSerializer(read_only=True)

    class Meta:
        model = Incidente
        fields = [
            'id', 
            'titulo', 
            'descripcion', 
            'tipo_incidente', 
            'fecha_incidente', 
            'fecha_de_registro', 
            'estado_incidente', 
            'gravedad', 
            'usuario', 
            'elemento'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print("Serializado:", data)  # Imprime los datos serializados
        if instance.pozo:
            data['elemento'] = {
                'id': instance.pozo.id,
                'nombre_elemento': instance.pozo.nombre_pozo,
                'tipo_elemento': instance.pozo.tipo_elemento
            }
        elif instance.copa:
            data['elemento'] = {
                'id': instance.copa.id,
                'nombre_elemento': instance.copa.nombre_copa,
                'tipo_elemento': instance.copa.tipo_elemento
            }
        elif instance.cisterna:
            data['elemento'] = {
                'id': instance.cisterna.id,
                'nombre_elemento': instance.cisterna.nombre_cisterna,
                'tipo_elemento': instance.cisterna.tipo_elemento
            }
        elif instance.bateria:
            data['elemento'] = {
                'id': instance.bateria.id,
                'nombre_elemento': instance.bateria.nombre_bateria,
                'tipo_elemento': instance.bateria.tipo_elemento
            }
        elif instance.bomba:
            data['elemento'] = {
                'id': instance.bomba.id,
                'nombre_elemento': instance.bomba.nombre_bomba,
                'tipo_elemento': instance.bomba.tipo_elemento
            }
        elif instance.punto_interno:
            data['elemento'] = {
                'id': instance.punto_interno.id,
                'nombre_elemento': instance.punto_interno.nombre_punto_interno,
                'tipo_elemento': instance.punto_interno.tipo_elemento
            }
        return data

class Incidente_post_serializer(ModelSerializer):
    # estado_incidente = serializers.PrimaryKeyRelatedField(queryset=Estado.objects.all(), many=False)
    # gravedad = serializers.PrimaryKeyRelatedField(queryset=Gravedad_incidente.objects.all(), many=False)
    class Meta:
        model = Incidente
        fields = [
            'titulo',
            'fecha_incidente',
            'estado_incidente',
            'gravedad',
            'tipo_elemento',
            
            'cisterna',
            'copa',
            'punto_de_control',
            'pozo',
            'bateria',
            'bomba',
            'punto_interno',
            
            'tipo_incidente',
            'usuario',
            'descripcion'
        ]
        
######################################################## NUEVO SERIALIZADOR  ######################################################## 

class Tipo_elemento_serializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre_tipo_elemento = serializers.CharField()

class Elemento_get(serializers.Serializer):
    id = serializers.IntegerField()
    nombre = serializers.CharField()
    tipo_elemento = Tipo_elemento_serializer()
    
class Elemento_post(serializers.Serializer):
    id = serializers.IntegerField()
    tipo_elemento = serializers.IntegerField()

class IncidenteAPIView_get_serializer(serializers.Serializer):
    id = serializers.IntegerField()
    titulo = serializers.CharField()
    descripcion = serializers.CharField()
    tipo_incidente = Tipo_incidente_serializer()
    fecha_incidente = serializers.DateField()
    fecha_de_registro = serializers.DateField()
    estado_incidente = Operacion_serializer()
    gravedad = Gravedad_incidente_serializer()
    usuario = Usuario_public_info()
    elemento = Elemento_get()
    
    class Meta:
        fields = [
            'id',
            'titulo',
            'descripcion',
            'tipo_incidente',
            'fecha_incidente',
            'fecha_de_registro',
            'estado_incidente',
            'gravedad',
            'usuario',
            'elemento',
        ]

class IncidenteAPIView_post_serializer(serializers.Serializer):
    titulo = serializers.CharField()
    descripcion = serializers.CharField(allow_blank=True, required=False)
    tipo_incidente = IntegerField()
    fecha_incidente = serializers.DateField()
    # fecha_de_registro = serializers.DateField()
    # estado_incidente = IntegerField()
    gravedad = IntegerField()
    usuario = IntegerField()
    elemento = Elemento_post()
    
    class Meta:
        fields = [
            'id',
            'titulo',
            'descripcion',
            'tipo_incidente',
            'fecha_incidente',
            'fecha_de_registro',
            'estado_incidente',
            'gravedad',
            'usuario',
            'elemento',
        ]