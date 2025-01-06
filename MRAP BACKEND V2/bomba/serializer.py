from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import Bomba
from .models import Bomba_usos
from incidente.models import Incidente
from tipo_elemento.models import Tipo_elemento
from tipo_elemento.serializer import Tipo_elemento_serializer
from estado.models import Estado
from estado.serializer import Estado_serializer
from usuario.serializer import Usuario_public_info

class Bomba_serializer(ModelSerializer):
    tipo_elemento = Tipo_elemento_serializer()
    estado = Estado_serializer()
    class Meta:
        model=Bomba
        fields=['id','estado','nombre_bomba','tipo_elemento']

class Bomba_post_serializer(ModelSerializer):
    estado = PrimaryKeyRelatedField(queryset=Estado.objects.all())
    tipo_elemento = PrimaryKeyRelatedField(queryset=Tipo_elemento.objects.all())
    
    class Meta:
        model = Bomba
        fields = ['id', 'estado', 'nombre_bomba', 'tipo_elemento']

    
  
class Bomba_usos_serializer(serializers.ModelSerializer):
    bomba = serializers.PrimaryKeyRelatedField( queryset=Bomba.objects.all(),many=False )
    class Meta:
        model = Bomba_usos
        fields = ['id', 'fecha_de_uso', 'horas_de_uso', 'bomba']
        
class Usos_registrados_serializer(ModelSerializer):
    bomba = Bomba_serializer()
    class Meta:
        model = Bomba_usos
        fields = ['id', 'fecha_de_uso', 'horas_de_uso', 'bomba']
        
class Bomba_incidentes_serializer(ModelSerializer):
    usuario = Usuario_public_info()
    bomba = Bomba_serializer()
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
            'bomba',
            'fecha_de_registro',
            'tipo_incidente',
            'usuario',
            'descripcion'
        ]