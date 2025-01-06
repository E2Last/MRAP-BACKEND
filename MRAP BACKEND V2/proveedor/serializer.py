from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
# tablas
from .models import Proveedor

class Proveedor_serializer(ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id','codigo_proveedor','nombre_proveedor']
        
class Proveedor_serializer(ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id','codigo_proveedor','nombre_proveedor']