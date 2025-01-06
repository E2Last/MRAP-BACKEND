from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
# response
from rest_framework.response import Response
from rest_framework import status
# DECORADORES
from rest_framework.decorators import api_view
from rest_framework.decorators import action
# models
from .models import Punto_interno
from estado.models import Estado
from incidente.models import Incidente
# serializadores
from .serializer import Punto_interno_serializer
from .serializer import Punto_interno_post_serializer
from .serializer import Punto_interno_incidente_serializer

class Punto_interno_view(ModelViewSet):
    queryset = Punto_interno.objects.all()
    serializer_class = Punto_interno_serializer
    
    def get_serializer_class(self):
        if self.action == 'incidentes_punto_interno':
            return Punto_interno_incidente_serializer
        elif self.action == 'list' or self.action == 'retrieve':
            return Punto_interno_serializer
        else:
            return Punto_interno_post_serializer
        
    @action(detail=True, methods=['GET'])
    def incidentes_punto_interno(self, request, pk=None):
        try:
            # Obtener la cisterna solicitada
            cisterna = Punto_interno.objects.get(pk=pk)
        except Punto_interno.DoesNotExist:
            return Response({"message": "Punto interno no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Filtrar los incidentes relacionados
        incidentes_cisterna = Incidente.objects.filter(cisterna=cisterna)

        # Serializar y devolver los datos de los incidentes usando Cisterna_incidentes_serializer
        serializer = Punto_interno_incidente_serializer(incidentes_cisterna, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)