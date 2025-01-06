from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from estado.serializer import Estado_serializer
from estado.models import Estado
from .models import Copa
from incidente.models import Incidente
from tipo_elemento.models import Tipo_elemento
from tipo_elemento.serializer import Tipo_elemento_serializer
from localidad.serializer import Localidad_serializer
from usuario.serializer import Usuario_public_info

class Copa_serializer(ModelSerializer):
    estado = Estado_serializer()
    tipo_elemento = Tipo_elemento_serializer()
    localidad = Localidad_serializer()
    class Meta:
        model=Copa
        fields=['id','nombre_copa','tipo_elemento','latitud','longitud','estado','localidad']
        
class Copa_post_serializer(ModelSerializer):
    estado = PrimaryKeyRelatedField(queryset=Estado.objects.all(), required=True)
    tipo_elemento = PrimaryKeyRelatedField(queryset=Tipo_elemento.objects.all(),many=False)
    class Meta:
        model=Copa
        fields=['nombre_copa','tipo_elemento','latitud','longitud','estado','localidad']
        
class Copa_incidente_serializer(ModelSerializer):
    usuario = Usuario_public_info()
    copa = Copa_serializer()
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
            'copa',
            'fecha_de_registro',
            'tipo_incidente',
            'usuario',
            'descripcion'
        ]