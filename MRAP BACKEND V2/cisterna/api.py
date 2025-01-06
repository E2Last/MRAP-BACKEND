from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
from rest_framework.exceptions import NotFound
# response
from rest_framework.response import Response
from rest_framework import status
# DECORADORES
from rest_framework.decorators import api_view
from rest_framework.decorators import action
# models
from .models import Cisterna
from incidente.models import Incidente
# serializadores
from .serializer import Cisterna_serializer, Cisterna_post_serializer, Cisterna_incidentes_serializer
# PERMISOS
# from rest_framework.permissions import IsAuthenticated

class Cisterna_view(ModelViewSet):
    queryset = Cisterna.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'incidentes_cisterna':
            return Cisterna_incidentes_serializer
        elif self.action in ['create', 'update']:
            return Cisterna_post_serializer
        return Cisterna_serializer
    
    @action(detail=True, methods=['GET'])
    def incidentes_cisterna(self, request, pk=None):
        try:
            # Obtener la cisterna solicitada
            cisterna = Cisterna.objects.get(pk=pk)
        except Cisterna.DoesNotExist:
            return Response({"message": "Cisterna no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        # Filtrar los incidentes relacionados
        incidentes_cisterna = Incidente.objects.filter(cisterna=cisterna)

        # Serializar y devolver los datos de los incidentes usando Cisterna_incidentes_serializer
        serializer = Cisterna_incidentes_serializer(incidentes_cisterna, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)