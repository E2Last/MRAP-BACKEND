from rest_framework.serializers import ModelSerializer
from .models import Localidad

class Localidad_serializer(ModelSerializer):
    class Meta:
        model=Localidad
        fields=['id','nombre']
        
class Localidad_nombre_serializer(ModelSerializer):
    class Meta:
        model=Localidad
        fields=['nombre']
        
    def to_representation(self, instance):
        return instance.nombre