from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Tipo_elemento

class Tipo_elemento_serializer(ModelSerializer):
    class Meta:
        model = Tipo_elemento
        fields = ['id','nombre_tipo_de_elemento']
        
class Tipo_elemento_nombre_serializer(ModelSerializer):
    class Meta:
        model = Tipo_elemento
        fields = ['nombre_tipo_de_elemento']
        
    def to_representation(self, instance):
        return instance.nombre_tipo_de_elemento