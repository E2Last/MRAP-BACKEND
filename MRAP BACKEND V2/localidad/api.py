from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
# RESPONSES
from rest_framework.response import Response
from rest_framework import status
# DECORADORES
from rest_framework.decorators import api_view
from rest_framework.decorators import action
# MODELS
from .models import Localidad
# SERIALIZADORES
from .serializer import Localidad_serializer

class Localidad_view(ModelViewSet):
    queryset=Localidad.objects.all()
    serializer_class=Localidad_serializer