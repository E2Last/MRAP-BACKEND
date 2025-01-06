from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from punto_control.models import Punto_de_control
from .serializer import Punto_de_control_serializer, Punto_de_control_post_serializer

from rest_framework.response import Response
from rest_framework import status
from .models import Punto_de_control

class Punto_control_view(ModelViewSet):
    queryset = Punto_de_control.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return Punto_de_control_serializer
        else:
            return Punto_de_control_post_serializer
