from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
# response
from rest_framework.response import Response
from rest_framework import status
# DECORADORES
from rest_framework.decorators import api_view
from rest_framework.decorators import action
# models
from .models import Bomba
from .models import Bomba_usos
from incidente.models import Incidente
# serializadores
from .serializer import Bomba_serializer
from .serializer import Bomba_post_serializer
from .serializer import Bomba_usos_serializer
from .serializer import Usos_registrados_serializer
from .serializer import Bomba_incidentes_serializer

# Create your views here.
class Bomba_view(ModelViewSet):
    queryset=Bomba.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'incidentes_bomba':
            return Bomba_incidentes_serializer
        elif self.action == 'create' or self.action == 'update':
            return Bomba_post_serializer
        else:
            return Bomba_serializer
    
    @action(detail=True, methods=['GET'])
    def usos_registrados(self, request, pk):
        try:
            bomba = Bomba.objects.get(pk=pk)
            usos = Bomba_usos.objects.filter(bomba=bomba)
            
            if usos.exists():
                serializer = Usos_registrados_serializer(usos, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Bomba sin usos registrados"}, status=status.HTTP_404_NOT_FOUND)

        except Bomba.DoesNotExist:
            return Response({"message": "Bomba no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
        
    @action(detail=True, methods=['GET'])
    def incidentes_bomba(self, request, pk=None):
        try:
            # Obtener la cisterna solicitada
            cisterna = Bomba.objects.get(pk=pk)
        except Bomba.DoesNotExist:
            return Response({"message": "Bomba no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        # Filtrar los incidentes relacionados
        incidentes_cisterna = Incidente.objects.filter(cisterna=cisterna)

        # Serializar y devolver los datos de los incidentes usando Cisterna_incidentes_serializer
        serializer = Bomba_incidentes_serializer(incidentes_cisterna, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class Bomba_usos_view(ModelViewSet):
    queryset = Bomba_usos.objects.all()
    serializer_class = Bomba_usos_serializer
    
    def get_view_description(self, html=False):
        return 'Gestor de usos de la bomba'
    
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return Usos_registrados_serializer
        else:
            return Bomba_usos_serializer