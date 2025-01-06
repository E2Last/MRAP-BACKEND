from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
# tablas
from .models import Pozo
from bomba.models import Bomba
from bateria.models import Bateria
from estado.models import Estado
from estado.serializer import Estado_serializer
from incidente.models import Incidente
# serializadores externos
from bomba.serializer import Bomba_serializer
from bateria.serializer import Bateria_serializer
from tipo_elemento.serializer import Tipo_elemento_serializer
from tipo_elemento.models import Tipo_elemento
from usuario.serializer import Usuario_public_info

class Pozo_serializer(ModelSerializer):    
    bateria = Bateria_serializer()
    bomba = Bomba_serializer()
    tipo_elemento = Tipo_elemento_serializer()
    estado = Estado_serializer()
    class Meta:
        model = Pozo
        fields = ['id','nombre_pozo','tipo_elemento','estado','bateria','bomba','latitud','longitud']
        
class Pozo_post_serializer(ModelSerializer):
    bateria = serializers.PrimaryKeyRelatedField(queryset=Bateria.objects.all(),many=False)
    bomba = serializers.PrimaryKeyRelatedField(queryset=Bomba.objects.all(),many=False)
    tipo_elemento = serializers.PrimaryKeyRelatedField(queryset=Tipo_elemento.objects.all(),many=False)
    estado = serializers.PrimaryKeyRelatedField(queryset=Estado.objects.all(),many=False)
    class Meta:
        model = Pozo
        fields = ['id','nombre_pozo','tipo_elemento','estado','bateria','bomba','latitud','longitud']
        
class Pozo_short_info(ModelSerializer):
    tipo_elemento = Tipo_elemento_serializer()
    
    class Meta:
        model = Pozo
        fields = ['id','nombre_pozo','tipo_elemento']
        
class Pozo_incidente_serializer(ModelSerializer):
    usuario = Usuario_public_info()
    pozo = Pozo_serializer
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
            'pozo',
            'fecha_de_registro',
            'tipo_incidente',
            'usuario',
            'descripcion'
        ]