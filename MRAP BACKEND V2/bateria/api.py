from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
# response
from rest_framework.response import Response
from rest_framework import status
# DECORADORES
from rest_framework.decorators import api_view
from rest_framework.decorators import action
# models
from .models import Bateria
from incidente.models import Incidente
# serializadores
from .serializer import Bateria_serializer, Bateria_post_serializer, Bateria_incidente_serializer

class Bateria_view(ModelViewSet):
    queryset = Bateria.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'incidentes_bateria':
            return Bateria_incidente_serializer
        elif self.action == 'create' or self.action == 'update':
            return Bateria_post_serializer
        return Bateria_serializer
    
    @action(detail=True, methods=['GET'])
    def incidentes_bateria(self, request, pk=None):
        try:
            bateria = Bateria.objects.get(pk=pk)
        except Bateria.DoesNotExist:
            return Response({"message": "Bateria no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        incidentes = Incidente.objects.filter(bateria=bateria)
        serializer = Bateria_incidente_serializer(incidentes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)