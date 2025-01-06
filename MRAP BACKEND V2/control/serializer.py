from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from usuario.serializer import Usuario_public_info
from punto_control.serializer import Punto_de_control_serializer
from analisis.serializer import Analisis_get_serializer
from analisis.serializer import Parametro_get_serializer
from proveedor.serializer import Proveedor_serializer
from control.models import Control
from control.models import Tipo_control
from control.models import Valores_control
from usuario.models import Usuario
from punto_control.models import Punto_de_control
from analisis.models import Analisis
from analisis.models import Parametro
from proveedor.models import Proveedor

class Tipo_control_serializer(ModelSerializer):
    class Meta:
        model = Tipo_control
        fields = [
            'id','tipo_control'
        ]

class Control_get_serializer(ModelSerializer):
    punto_de_control = Punto_de_control_serializer()
    usuario = Usuario_public_info()
    proveedor = Proveedor_serializer()
    analisis = Analisis_get_serializer()
    tipo_control = Tipo_control_serializer()
    
    class Meta:
        model = Control
        fields = [
            'id','aprobado','punto_de_control','usuario','fecha','proveedor','analisis','tipo_control'
        ]

class Control_post_serializer(ModelSerializer):
    punto_de_control = PrimaryKeyRelatedField(queryset=Punto_de_control.objects.all(), many=False)
    usuario = PrimaryKeyRelatedField(queryset=Usuario.objects.all(), many=False)
    proveedor = PrimaryKeyRelatedField(queryset=Proveedor.objects.all(), many=False)
    analisis = PrimaryKeyRelatedField(queryset=Analisis.objects.all(), many=False)
    tipo_control = PrimaryKeyRelatedField(queryset=Tipo_control.objects.all(), many=False)
    
    class Meta:
        model = Control
        fields = [
            'id','aprobado','punto_de_control','usuario','fecha','proveedor','analisis', 'tipo_control'
        ]
        
class Valores_control_post_serializer(ModelSerializer):
    # control = PrimaryKeyRelatedField(queryset=Control.objects.all(), many=False)
    analisis = PrimaryKeyRelatedField(queryset=Analisis.objects.all(), many=False)
    parametro = PrimaryKeyRelatedField(queryset=Parametro.objects.all(), many=False)
    tipo_control = PrimaryKeyRelatedField(queryset=Tipo_control.objects.all(), many=False)
    
    class Meta:
        model = Valores_control
        fields = [
            # 'id',
            # 'control',
            'analisis','parametro','tipo_control','valor'
        ]

class Valores_control_put_serializer(ModelSerializer):
    control = PrimaryKeyRelatedField(queryset=Control.objects.all(), many=False)
    analisis = PrimaryKeyRelatedField(queryset=Analisis.objects.all(), many=False)
    parametro = PrimaryKeyRelatedField(queryset=Parametro.objects.all(), many=False)
    tipo_control = PrimaryKeyRelatedField(queryset=Tipo_control.objects.all(), many=False)
    
    class Meta:
        model = Valores_control
        fields = [
            # 'id',
            'control',
            'analisis','parametro','tipo_control','valor'
        ]

class Valores_control_get_serializer(ModelSerializer):
    control = Control_get_serializer()
    analisis = Analisis_get_serializer()
    parametro = Parametro_get_serializer()
    tipo_control = Tipo_control_serializer()
    
    class Meta:
        model = Valores_control
        fields = [
            'id','control','analisis','parametro','tipo_control','valor'
        ]