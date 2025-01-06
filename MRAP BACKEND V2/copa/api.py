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
from .models import Copa
from incidente.models import Incidente
# serializadores
from .serializer import Copa_serializer
from .serializer import Copa_post_serializer
from .serializer import Copa_incidente_serializer

class Copa_view(ModelViewSet):
    queryset = Copa.objects.all()
    serializer_class = Copa_serializer
    
    # dependiendo de el tipo de request se opta por un serializador
    def get_serializer_class(self):
        if self.action == 'incidentes_copa':
            return Copa_incidente_serializer
        elif self.action == 'list' or self.action == 'retrieve':
            return Copa_serializer
        else:
            return Copa_post_serializer
        
    @action(detail=True, methods=['GET'])
    def incidentes_copa(self, request, pk=None):
        try:
            # obtener la copa relacionada
            copa = Copa.objects.get(pk=pk)
        except Copa.DoesNotExist:
            return Response({"message": "Copa no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        # filtrar los incidentes asoaciados a la copa
        incidentes_copa = Incidente.objects.filter(copa = copa)
        serializer = Copa_incidente_serializer(incidentes_copa, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)