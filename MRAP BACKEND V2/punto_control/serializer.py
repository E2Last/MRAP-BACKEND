from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import PrimaryKeyRelatedField
from .models import Punto_de_control
from pozo.models import Pozo
from copa.models import Copa
from cisterna.models import Cisterna
from bateria.models import Bateria
from bomba.models import Bomba
from punto_interno.models import Punto_interno

from pozo.serializer import Pozo_serializer
from copa.serializer import Copa_serializer
from cisterna.serializer import Cisterna_serializer
from bateria.serializer import Bateria_serializer
from bomba.serializer import Bomba_serializer
from punto_interno.serializer import Punto_interno_serializer
from estado.serializer import Estado_serializer

"""
    pozo = PrimaryKeyRelatedField(queryset=Pozo.objects.all(), allow_null=True, required=False)
    copa = PrimaryKeyRelatedField(queryset=Copa.objects.all(), allow_null=True, required=False)
    cisterna = PrimaryKeyRelatedField(queryset=Cisterna.objects.all(), allow_null=True, required=False)
    bateria = PrimaryKeyRelatedField(queryset=Bateria.objects.all(), allow_null=True, required=False)
    bomba = PrimaryKeyRelatedField(queryset=Bomba.objects.all(), allow_null=True, required=False)
    punto_interno = PrimaryKeyRelatedField(queryset=Punto_interno.objects.all(), allow_null=True, required=False)
"""

class Punto_de_control_serializer(ModelSerializer):
    pozo = Pozo_serializer()
    copa = Copa_serializer()
    cisterna = Cisterna_serializer()
    bateria = Bateria_serializer()
    bomba = Bomba_serializer()
    punto_interno = Punto_interno_serializer()
    estado = Estado_serializer()
    
    class Meta:
        model = Punto_de_control
        fields = [
            'id',
            'pozo',
            'copa',
            'cisterna',
            'bateria',
            'bomba',
            'punto_interno',
            'estado',
            'nombre_punto_de_control',
            'estado_retrasos'
        ]
        
class Punto_de_control_post_serializer(ModelSerializer):
    
    pozo = PrimaryKeyRelatedField(queryset=Pozo.objects.all(), allow_null=True, required=False)
    copa = PrimaryKeyRelatedField(queryset=Copa.objects.all(), allow_null=True, required=False)
    cisterna = PrimaryKeyRelatedField(queryset=Cisterna.objects.all(), allow_null=True, required=False)
    bateria = PrimaryKeyRelatedField(queryset=Bateria.objects.all(), allow_null=True, required=False)
    bomba = PrimaryKeyRelatedField(queryset=Bomba.objects.all(), allow_null=True, required=False)
    punto_interno = PrimaryKeyRelatedField(queryset=Punto_interno.objects.all(), allow_null=True, required=False)
    
    class Meta:
        model = Punto_de_control
        fields = [
            'id',
            'pozo',
            'copa',
            'cisterna',
            'bateria',
            'bomba',
            'punto_interno',
            'estado',
            'nombre_punto_de_control',
            'estado_retrasos',
        ]