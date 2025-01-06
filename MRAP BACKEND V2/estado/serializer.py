from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Estado

class Estado_serializer(ModelSerializer):
    class Meta:
        model=Estado
        fields=['id','descripcion']
        
class Estado_descripcion_serializer(ModelSerializer):
    class Meta:
        model=Estado
        fields=['descripcion']
        
    def to_representation(self, instance):
        return instance.descripcion