from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
# tablas
from .models import Punto_interno
from estado.models import Estado
from usuario.serializer import Usuario_public_info
from incidente.models import Incidente
# serializadores externos
from estado.serializer import Estado_serializer
from tipo_elemento.serializer import Tipo_elemento_serializer
from tipo_elemento.models import Tipo_elemento

class Punto_interno_serializer(ModelSerializer):
    estado = Estado_serializer()
    tipo_elemento = Tipo_elemento_serializer()
    class Meta:
        model = Punto_interno
        fields = ['id','estado','nombre_punto_interno','tipo_elemento','latitud','longitud']
        
class Punto_interno_post_serializer(ModelSerializer):
    estado = serializers.PrimaryKeyRelatedField(queryset=Estado.objects.all(),many=False)
    tipo_elemento = serializers.PrimaryKeyRelatedField(queryset=Tipo_elemento.objects.all(), many=False)
    class Meta:
        model = Punto_interno
        fields = ['id','estado','nombre_punto_interno','tipo_elemento','latitud','longitud']
        
class Punto_interno_incidente_serializer(ModelSerializer):
    usuario = Usuario_public_info()
    punto_interno = Punto_interno_serializer()
    estado_incidente = serializers.SerializerMethodField()
    gravedad = serializers.SerializerMethodField()
    tipo_incidente = serializers.SerializerMethodField()
    
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
            'punto_interno',
            'fecha_de_registro',
            'tipo_incidente',
            'usuario',
            'descripcion'
        ]