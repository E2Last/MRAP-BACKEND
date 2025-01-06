from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
# response
from rest_framework.response import Response
from rest_framework import status
# DECORADORES
from rest_framework.decorators import api_view
from rest_framework.decorators import action
# models
from .models import Proveedor
# serializadores
from .serializer import Proveedor_serializer

class Proveedor_view(ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = Proveedor_serializer