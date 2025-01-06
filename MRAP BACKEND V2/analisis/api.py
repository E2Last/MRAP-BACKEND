from django.db import connection
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Unidad
from .models import Parametro
from .models import Periodicidad
from .models import Intervalo_referencia
from .models import Analisis
from .models import Periodo_analisis_elemento
from .serializer import Unidad_serializer
from .serializer import Parametro_get_serializer
from .serializer import Parametro_post_serializer
from .serializer import Periodicidad_serializer
from .serializer import Intervalo_referencia_get_serializer
from .serializer import Intervalo_referencia_post_serializer
from .serializer import Analisis_get_serializer
from .serializer import Analisis_post_serializer
from .serializer import Periodo_analisis_elemento_get_serializer
from .serializer import Periodo_analisis_elemento_post_serializer

class Unidad_view(ModelViewSet):
    queryset = Unidad.objects.all()
    serializer_class = Unidad_serializer
    
class Parametro_view(ModelViewSet):
    queryset = Parametro.objects.all()
    #serializer_class = Parametro_get_serializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return Parametro_get_serializer
        else:
            return Parametro_post_serializer
        
class Periodicidad_view(ModelViewSet):
    queryset = Periodicidad.objects.all()
    serializer_class = Periodicidad_serializer
    
class Intervalo_referencia_view(ModelViewSet):
    queryset = Intervalo_referencia.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return Intervalo_referencia_get_serializer
        else:
            return Intervalo_referencia_post_serializer
        
class Analisis_view(ModelViewSet):
    queryset = Analisis.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return Analisis_get_serializer
        else:
            return Analisis_post_serializer

class Periodo_analisis_elemento_view(ModelViewSet):
    queryset = Periodo_analisis_elemento.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list','retrieve']:
            return Periodo_analisis_elemento_get_serializer
        else:
            return Periodo_analisis_elemento_post_serializer

@api_view(['GET'])
def parametros_sin_asignar(request, pk):
    
    analisis = Analisis.objects.get(id=pk)
    
    analisis = {
        'id': analisis.id,
        'nombre': analisis.nombre,
    }
    
    print(f'\n{analisis}\n')
    
    parametros_asociados = list(Analisis.objects.filter(id=pk).values_list('parametros', flat=True))

    parametros_no_asociados = list(Parametro.objects.exclude(id__in=parametros_asociados).values_list('id', flat=True))
    
    listado_parametros_asociados = []
    listado_parametros_no_asociados = []
    
    for parametro_id in parametros_asociados:
        parametro = Parametro.objects.get(id=parametro_id)
        serializado = Parametro_get_serializer(parametro)
        listado_parametros_asociados.append(serializado.data)

    for parametro_id in parametros_no_asociados:
        parametro = Parametro.objects.get(id=parametro_id)
        serializado = Parametro_get_serializer(parametro)
        listado_parametros_no_asociados.append(serializado.data)
    
    return Response({'analisis': analisis, 'parametros_asociados':listado_parametros_asociados, 'parametros_sin_asociar': listado_parametros_no_asociados}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def obtener_tabla_analisis(request):
    data = []
    # recordar que estoy parado sobre Periodo_analisis_elemento
    join = list(
        Periodo_analisis_elemento.objects.prefetch_related('analisis').values(
            'id',
            'analisis__id',         # viene de la relacion de Periodo_analisis_elemento con analisis, por eso debo usar analisis__id para acceder al valor de la id del analisis del join
            'analisis__nombre',
            'tipo_elemento',
            'tipo_elemento__nombre_tipo_de_elemento',
            'periodo',
            'periodo__periodicidad_nombre',
        )
    )
    
    for periodo_analisis_elemento in join:
        data.append({
            "id": periodo_analisis_elemento["id"],
            "analisis_id": periodo_analisis_elemento['analisis__id'],
            "analisis_nombre": periodo_analisis_elemento['analisis__nombre'],
            "tipo_elemento": {
                "id": periodo_analisis_elemento['tipo_elemento'],
                "nombre": periodo_analisis_elemento['tipo_elemento__nombre_tipo_de_elemento']
            },
            "periodicidad": {
                "id": periodo_analisis_elemento['periodo'],
                "nombre": periodo_analisis_elemento['periodo__periodicidad_nombre']
            }
        })
    
    return Response(data, status.HTTP_200_OK)

@api_view(['GET'])
def obtener_parametros_asociados(request, pk):
    try:
        # Obtener los IDs de parámetros relacionados en una sola consulta
        parametros_ids = Analisis.objects.filter(id=pk).values_list('parametros', flat=True)
        
        # Obtener los detalles de todos los parámetros relacionados
        parametros_data = list(
            Parametro.objects.filter(id__in=parametros_ids).values(
                'id',
                'nombre_parametro',
                'texto',
                'numero'
            )
        )
        
        # Agregar el campo adicional 'analisis_id' a cada parámetro
        for parametro in parametros_data:
            parametro['analisis_id'] = pk

        return Response(data=parametros_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(data=str(e), status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def obtener_analisis_por_control(request, controlID):
    listado_analisis = Analisis.objects.filter(tipo_control_id=controlID)
    
    listado_serializado = Analisis_get_serializer(listado_analisis, many=True)
        
    return Response(data=listado_serializado.data, status=status.HTTP_200_OK)