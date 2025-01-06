from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
# RESPONSES
from rest_framework.response import Response
from rest_framework import status
# DECORADORES
from rest_framework.decorators import api_view
from rest_framework.decorators import action
# MODELS
from .models import Estado
# SERIALIZADORES
from .serializer import Estado_serializer

class Estado_view(ModelViewSet):
    queryset=Estado.objects.all()
    serializer_class=Estado_serializer