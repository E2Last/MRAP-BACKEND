from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import Cisterna
from incidente.models import Incidente
from estado.models import Estado
from localidad.models import Localidad
from tipo_elemento.models import Tipo_elemento
from usuario.serializer import Usuario_public_info
from tipo_elemento.serializer import Tipo_elemento_nombre_serializer, Tipo_elemento_serializer
from estado.serializer import Estado_descripcion_serializer, Estado_serializer
from localidad.serializer import Localidad_nombre_serializer, Localidad_serializer

class Cisterna_serializer(ModelSerializer):
    tipo_elemento = Tipo_elemento_serializer()
    estado = Estado_serializer()
    localidad = Localidad_serializer()
    
    class Meta:
        model=Cisterna
        fields=['id','nombre_cisterna','tipo_elemento','latitud','longitud','estado','localidad']

class Cisterna_retrieve_serializer(ModelSerializer):
    class Meta:
        model=Cisterna
        fields=['id','nombre_cisterna','tipo_elemento','latitud','longitud','estado','localidad']

class Cisterna_post_serializer(ModelSerializer):
    tipo_elemento = PrimaryKeyRelatedField(queryset=Tipo_elemento.objects.all(), many=False)
    estado = PrimaryKeyRelatedField(queryset=Estado.objects.all(), many=False)
    localidad = PrimaryKeyRelatedField(queryset=Localidad.objects.all(), many=False)

    class Meta:
        model = Cisterna
        fields = ['id', 'nombre_cisterna', 'tipo_elemento', 'latitud', 'longitud', 'estado', 'localidad']      
        
class Cisterna_incidentes_serializer(ModelSerializer):
    usuario = Usuario_public_info()
    cisterna = Cisterna_serializer()
    estado_incidente = serializers.SerializerMethodField()
    gravedad = serializers.SerializerMethodField()
    tipo_incidente = serializers.SerializerMethodField()
    
    # Importación diferida: esto se hace asi porque incidente y cisternas importan _
    # mutuamente sus serializadores, estoy provoca una importacion circular, de ahi esta solucion
    def get_estado_incidente(self, obj):
        from incidente.serializer import Operacion_serializer 
        return Operacion_serializer(obj.estado_incidente).data
    
    def get_gravedad(self, obj):
        from incidente.serializer import Gravedad_incidente_serializer
        return Gravedad_incidente_serializer(obj.gravedad).data
    
    def get_tipo_incidente(self, obj):
        from incidente.serializer import Tipo_incidente_serializer
        return Tipo_incidente_serializer(obj.tipo_incidente).data

    class Meta:
        model = Incidente
        fields = [
            'id',
            'titulo',
            'estado_incidente',
            'fecha_incidente',
            'gravedad',
            'cisterna',
            'fecha_de_registro',
            'tipo_incidente',
            'usuario',
            'descripcion'
        ]