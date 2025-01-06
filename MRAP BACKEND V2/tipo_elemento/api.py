from rest_framework.viewsets import ModelViewSet
from .models import Tipo_elemento
from .serializer import Tipo_elemento_serializer

class Tipo_de_elemento_view(ModelViewSet):
    queryset = Tipo_elemento.objects.all()
    serializer_class = Tipo_elemento_serializer