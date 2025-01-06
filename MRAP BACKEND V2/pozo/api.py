from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
# response
from rest_framework.response import Response
from rest_framework import status
# DECORADORES
from rest_framework.decorators import api_view
from rest_framework.decorators import action
# models
from .models import Pozo
from bomba.models import Bomba
from bateria.models import Bateria
from incidente.models import Incidente
# serializadores
from .serializer import Pozo_serializer
from .serializer import Pozo_post_serializer
from .serializer import Pozo_incidente_serializer

class Pozo_view(ModelViewSet):
    queryset = Pozo.objects.all()
    serializer_class = Pozo_serializer
    
    def get_serializer_class(self):
        if self.action == 'incidentes_pozo':
            return Pozo_incidente_serializer
        elif self.action == 'list' or self.action == 'retrieve':
            return Pozo_serializer
        else:
            return Pozo_post_serializer
        
    @action(detail=True, methods=['GET'])
    def incidentes_pozo(self, request, pk=None):
        try:
            pozo = Pozo.objects.get(pk=pk)
        except Pozo.DoesNotExist:
            return Response({"message": "Pozo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        incidentes = Incidente.objects.filter(pozo=pozo)

        serializer = Pozo_incidente_serializer(incidentes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)