from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
# RESPONSE
from rest_framework.response import Response
from rest_framework import status
# MODELS
from .models import Incidente_operacion
from .models import Incidente
from .models import Gravedad_incidente
from .models import Tipo_incidente
from .models import Operacion
from tipo_elemento.models import Tipo_elemento
from bomba.models import Bomba
from bateria.models import Bateria
from cisterna.models import Cisterna
from copa.models import Copa
from pozo.models import Pozo
from punto_interno.models import Punto_interno
from estado.models import Estado
from usuario.models import Usuario
# SERIALIZADORES
from .serializer import Incidente_operacion_post_serializer
from .serializer import Incidente_operacion_serializer
from .serializer import Gravedad_incidente_serializer
from .serializer import Tipo_incidente_serializer
from .serializer import Operacion_serializer
from .serializer import Incidente_get_serializer
from .serializer import Incidente_post_serializer
from .serializer import IncidenteAPIView_get_serializer
from .serializer import IncidenteAPIView_post_serializer

class Paginacion(PageNumberPagination):
    page_size = 10
    page_query_param = 'page'

    # def get_paginated_response(self, data):
    #     return Response({
    #         'count': self.page.paginator.count,
    #         'next': self.get_next_link(),
    #         'previous': self.get_previous_link(),
    #         'results': data
    #     })

class Gravedad_incidente_view(ModelViewSet):
    queryset = Gravedad_incidente.objects.all()
    serializer_class = Gravedad_incidente_serializer
    
class Tipo_incidente_view(ModelViewSet):
    queryset = Tipo_incidente.objects.all()
    serializer_class = Tipo_incidente_serializer

class Operacion_view(ModelViewSet):
    queryset = Operacion.objects.all()
    serializer_class = Operacion_serializer

class Incidente_view(APIView):
    
    def get(self, request):
        try:
            paginator = Paginacion()
            incidentes = Incidente.objects.all().order_by('-id')
            resultado = paginator.paginate_queryset(incidentes, request)
            data = []
            for incidente in resultado:
                incidente_data = {
                    'id': incidente.id,
                    'titulo': incidente.titulo,
                    'descripcion': incidente.descripcion,
                    'tipo_incidente': {
                        'id': incidente.tipo_incidente.id,
                        'descripcion_tipo_incidente': incidente.tipo_incidente.descripcion_tipo_incidente,
                    },
                    'fecha_incidente': incidente.fecha_incidente,
                    'fecha_de_registro': incidente.fecha_de_registro,
                    'estado_incidente': {
                        'id': incidente.estado_incidente.id,
                        'descripcion_operacion': incidente.estado_incidente.descripcion_operacion
                    },
                    'gravedad': {
                        'id': incidente.gravedad.id,
                        'descripcion': incidente.gravedad.descripcion
                    },
                    'usuario': {
                        'id': incidente.usuario.id,
                        'username': incidente.usuario.username,
                        'nombre': incidente.usuario.nombre,
                        'apellido': incidente.usuario.apellido,
                        'alias': incidente.usuario.alias,
                        'perfil': incidente.usuario.perfil,
                    }
                }
                
                if incidente.bomba:
                    incidente_data['elemento'] = {
                        'id': incidente.bomba.id,
                        'nombre': incidente.bomba.nombre_bomba,
                        'tipo_elemento': {
                            'id': incidente.bomba.tipo_elemento.id,
                            'nombre_tipo_elemento': incidente.bomba.tipo_elemento.nombre_tipo_de_elemento
                        }
                    }
                    
                if incidente.bateria:
                    incidente_data['elemento'] = {
                        'id': incidente.bateria.id,
                        'nombre': incidente.bateria.nombre_bateria,
                        'tipo_elemento': {
                            'id': incidente.bateria.tipo_elemento.id,
                            'nombre_tipo_elemento': incidente.bateria.tipo_elemento.nombre_tipo_de_elemento
                        }
                    }
                    
                if incidente.cisterna:
                    incidente_data['elemento'] = {
                        'id': incidente.cisterna.id,
                        'nombre': incidente.cisterna.nombre_cisterna,
                        'tipo_elemento': {
                            'id': incidente.cisterna.tipo_elemento.id,
                            'nombre_tipo_elemento': incidente.cisterna.tipo_elemento.nombre_tipo_de_elemento
                        }
                    }
                
                if incidente.copa:
                    incidente_data['elemento'] = {
                        'id': incidente.copa.id,
                        'nombre': incidente.copa.nombre_copa,
                        'tipo_elemento': {
                            'id': incidente.copa.tipo_elemento.id,
                            'nombre_tipo_elemento': incidente.copa.tipo_elemento.nombre_tipo_de_elemento
                        }
                    }
                    
                if incidente.pozo:
                    incidente_data['elemento'] = {
                        'id': incidente.pozo.id,
                        'nombre': incidente.pozo.nombre_pozo,
                        'tipo_elemento': {
                            'id': incidente.pozo.tipo_elemento.id,
                            'nombre_tipo_elemento': incidente.pozo.tipo_elemento.nombre_tipo_de_elemento
                        }
                    }
                    
                if incidente.punto_interno:
                    incidente_data['elemento'] = {
                        'id': incidente.punto_interno.id,
                        'nombre': incidente.punto_interno.nombre_punto_interno,
                        'tipo_elemento': {
                            'id': incidente.punto_interno.tipo_elemento.id,
                            'nombre_tipo_elemento': incidente.punto_interno.tipo_elemento.nombre_tipo_de_elemento
                        }
                    }
                                
                data.append(incidente_data)
                
            serializer = IncidenteAPIView_get_serializer(data, many=True)
            
            return paginator.get_paginated_response(serializer.data)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        serializer = IncidenteAPIView_post_serializer(data=request.data)

        try:
            if serializer.is_valid():
                # Acceso a los datos validados
                datos_recibidos = serializer.validated_data

                data_elemento = datos_recibidos.get('elemento')
                elemento_id = data_elemento.get('id')
                tipo_elemento_id = data_elemento.get('tipo_elemento')

                try:
                    tipo_elemento = Tipo_elemento.objects.get(pk=tipo_elemento_id)
                except Tipo_elemento.DoesNotExist:
                    raise serializers.ValidationError('El tipo de elemento no existe')
                
                nombre_tipo_elemento = tipo_elemento.nombre_tipo_de_elemento

                # Diccionario para mapear el tipo de elemento con su modelo correspondiente
                tipo_elemento_dict = {
                    'Bomba': Bomba,
                    'Bateria': Bateria,
                    'Cisterna': Cisterna,
                    'Copa': Copa,
                    'Pozo': Pozo,
                    'Punto_interno': Punto_interno
                }

                # Comprobar si el tipo de elemento es válido y obtener el objeto correspondiente
                if nombre_tipo_elemento in tipo_elemento_dict:
                    modelo_elemento = tipo_elemento_dict[nombre_tipo_elemento]
                    try:
                        elemento = modelo_elemento.objects.get(pk=elemento_id)
                    except modelo_elemento.DoesNotExist:
                        raise serializers.ValidationError(f"El elemento con id {elemento_id} no existe para el tipo {nombre_tipo_elemento}")

                    # Obtener los ids para los otros campos
                    tipo_incidente_id = datos_recibidos['tipo_incidente']
                    gravedad_id = datos_recibidos['gravedad']
                    usuario_id = datos_recibidos['usuario']

                    # Validar existencias
                    if not Tipo_incidente.objects.filter(pk=tipo_incidente_id).exists():
                        raise serializers.ValidationError("El tipo de incidente no existe")
                    
                    if not Gravedad_incidente.objects.filter(pk=gravedad_id).exists():
                        raise serializers.ValidationError("La gravedad no existe")
                    
                    if not Usuario.objects.filter(pk=usuario_id).exists():
                        raise serializers.ValidationError("El usuario no existe")
                    
                    # Obtener el valor de 'descripcion' y asignar None si es una cadena vacía
                    descripcion = datos_recibidos.get('descripcion', None)
                    if descripcion == "":
                        descripcion = None

                    # Crear el incidente
                    incidente = Incidente.objects.create(
                        titulo=datos_recibidos['titulo'],
                        fecha_incidente=datos_recibidos['fecha_incidente'],
                        descripcion=descripcion,  # Ahora gestionamos la cadena vacía explícitamente
                        gravedad_id=gravedad_id,
                        usuario_id=usuario_id,
                        tipo_incidente_id=tipo_incidente_id,
                        **{f'{nombre_tipo_elemento.lower()}_id': elemento.id},
                        tipo_elemento_id=tipo_elemento_id,
                    )
                    
                    incidente_operacion = Incidente_operacion.objects.create(
                        incidente = incidente,
                        operacion = Operacion.objects.get(descripcion_operacion='Registrado'),
                        usuario = incidente.usuario                  
                    )
                    
                    cambiar_estado_elemento(incidente.id)
                    
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response({"detail": "Tipo de elemento no válido"}, status=status.HTTP_400_BAD_REQUEST)      

        except serializers.ValidationError as e:
            # Captura los errores de validación y los devuelve en la respuesta
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Captura cualquier otro error inesperado
            return Response({"detail": f"Error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)       

@api_view(['GET'])
def get_incidente(request, pk):
    try:
        incidente = Incidente.objects.get(id=pk)
        
        incidente_data = {
            'id': incidente.id,
            'titulo': incidente.titulo,
            'descripcion': incidente.descripcion,
            'tipo_incidente': {
                'id': incidente.tipo_incidente.id,
                'descripcion_tipo_incidente': incidente.tipo_incidente.descripcion_tipo_incidente,
                # 'inhabilitar_elemento': incidente.tipo_incidente.inhabilitar_elemento
            },
            'fecha_incidente': incidente.fecha_incidente,
            'fecha_de_registro': incidente.fecha_de_registro,
            'estado_incidente': {
                'id': incidente.estado_incidente.id,
                'descripcion_operacion': incidente.estado_incidente.descripcion_operacion
            },
            'gravedad': {
                'id': incidente.gravedad.id,
                'descripcion': incidente.gravedad.descripcion
            },
            'usuario': {
                'id': incidente.usuario.id,
                'username': incidente.usuario.username,
                'nombre': incidente.usuario.nombre,
                'apellido': incidente.usuario.apellido,
                'alias': incidente.usuario.alias,
                'perfil': incidente.usuario.perfil,
            }
        }
        
        if incidente.bomba:
            incidente_data['elemento'] = {
                'id': incidente.bomba.id,
                'nombre': incidente.bomba.nombre_bomba,
                'tipo_elemento': {
                    'id': incidente.bomba.tipo_elemento.id,
                    'nombre_tipo_elemento': incidente.bomba.tipo_elemento.nombre_tipo_de_elemento
                }
            }
                    
        if incidente.bateria:
            incidente_data['elemento'] = {
                'id': incidente.bateria.id,
                'nombre': incidente.bateria.nombre_bateria,
                'tipo_elemento': {
                    'id': incidente.bateria.tipo_elemento.id,
                    'nombre_tipo_elemento': incidente.bateria.tipo_elemento.nombre_tipo_de_elemento
                }
            }
                    
        if incidente.cisterna:
            incidente_data['elemento'] = {
                'id': incidente.cisterna.id,
                'nombre': incidente.cisterna.nombre_cisterna,
                'tipo_elemento': {
                    'id': incidente.cisterna.tipo_elemento.id,
                    'nombre_tipo_elemento': incidente.cisterna.tipo_elemento.nombre_tipo_de_elemento
                }
            }
                
        if incidente.copa:
            incidente_data['elemento'] = {
                'id': incidente.copa.id,
                'nombre': incidente.copa.nombre_copa,
                'tipo_elemento': {
                    'id': incidente.copa.tipo_elemento.id,
                    'nombre_tipo_elemento': incidente.copa.tipo_elemento.nombre_tipo_de_elemento
                }
            }
                    
        if incidente.pozo:
            incidente_data['elemento'] = {
                'id': incidente.pozo.id,
                'nombre': incidente.pozo.nombre_pozo,
                'tipo_elemento': {
                    'id': incidente.pozo.tipo_elemento.id,
                    'nombre_tipo_elemento': incidente.pozo.tipo_elemento.nombre_tipo_de_elemento
                }
            }
                    
        if incidente.punto_interno:
            incidente_data['elemento'] = {
                'id': incidente.punto_interno.id,
                'nombre': incidente.punto_interno.nombre_punto_interno,
                'tipo_elemento': {
                    'id': incidente.punto_interno.tipo_elemento.id,
                    'nombre_tipo_elemento': incidente.punto_interno.tipo_elemento.nombre_tipo_de_elemento
                }
            }
    
        serializer = IncidenteAPIView_get_serializer(incidente_data, many=False)
        
        # print(f'{incidente_data}\n')
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
        # return Response({'message':'incidente encontrado'}, status=status.HTTP_302_FOUND)
    except Incidente.DoesNotExist:
        return Response({'message': 'incidente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def put_incidente(request, pk):
    try:
        incidente = Incidente.objects.get(id=pk)
        
        data = request.data
        
        incidente.titulo = data.get('titulo', incidente.titulo)
        
        incidente.descripcion = data.get('descripcion', incidente.descripcion)
        
        tipo_incidente_id = data.get('tipo_incidente')
        incidente.tipo_incidente = Tipo_incidente.objects.get(id=tipo_incidente_id)
        
        incidente.fecha_incidente = data.get('fecha_incidente', incidente.fecha_incidente)
        incidente.fecha_de_registro = data.get('fecha_de_registro', incidente.fecha_de_registro)
        
        estado_incidente_id = data.get('estado_incidente')
        incidente.estado_incidente = Operacion.objects.get(id=estado_incidente_id)
        
        gravedad_id = data.get('gravedad')
        incidente.gravedad = Gravedad_incidente.objects.get(id=gravedad_id)
        
        usuario_id = data.get('usuario', incidente.usuario)
        incidente.usuario = Usuario.objects.get(id=usuario_id)
        
        elemento = data.get('elemento')
            
        # BOMBA
        if elemento['tipo_elemento'] == 1:
            incidente.bateria = None
            incidente.cisterna = None
            incidente.copa = None
            incidente.pozo = None
            incidente.punto_interno = None
            
            bomba = Bomba.objects.get(id=elemento['id'])
            incidente.bomba = bomba
            incidente.tipo_elemento = bomba.tipo_elemento
        
        # BATERIA
        if elemento['tipo_elemento'] == 2:
            incidente.bomba = None
            incidente.cisterna = None
            incidente.copa = None
            incidente.pozo = None
            incidente.punto_interno = None
            
            bateria = Bateria.objects.get(id=elemento['id'])
            incidente.bateria = bateria
            incidente.tipo_elemento = bateria.tipo_elemento
            
        # CISTERNA
        if elemento['tipo_elemento'] == 3:
            incidente.bateria = None
            incidente.bomba = None
            incidente.copa = None
            incidente.pozo = None
            incidente.punto_interno = None
            
            cisterna = Cisterna.objects.get(id=elemento['id'])
            incidente.cisterna = cisterna
            incidente.tipo_elemento = cisterna.tipo_elemento
            
        # COPA
        if elemento['tipo_elemento'] == 4:
            incidente.bateria = None
            incidente.bomba = None
            incidente.cisterna = None
            incidente.pozo = None
            incidente.punto_interno = None
            
            copa = Copa.objects.get(id=elemento['id'])
            incidente.copa = copa
            incidente.tipo_elemento = copa.tipo_elemento
        
        # POZO
        if elemento['tipo_elemento'] == 5:
            incidente.bateria = None
            incidente.bomba = None
            incidente.cisterna = None
            incidente.copa = None
            incidente.punto_interno = None
            
            pozo = Pozo.objects.get(id=elemento['id'])
            incidente.pozo = pozo
            incidente.tipo_elemento = pozo.tipo_elemento
        
        # PUNTO INTERNO
        if elemento['tipo_elemento'] == 6:
            incidente.bateria = None
            incidente.bomba = None
            incidente.cisterna = None
            incidente.copa = None
            incidente.pozo = None
            
            punto_interno = Punto_interno.objects.get(id=elemento['id'])
            incidente.punto_interno = punto_interno
            incidente.tipo_elemento = punto_interno.tipo_elemento
        
        tipo_elemento_dict = {
            'Bomba': Bomba,
            'Bateria': Bateria,
            'Cisterna': Cisterna,
            'Copa': Copa,
            'Pozo': Pozo,
            'Punto_interno': Punto_interno
        }
        
        tipo_elemento = Tipo_elemento.objects.get(id=elemento['tipo_elemento'])
        tipo_incidente = Tipo_incidente.objects.get(pk=tipo_incidente_id)
        
        tipo_elemento = str(tipo_elemento)
        tipo_incidente = Tipo_incidente.objects.get(pk=tipo_incidente_id)
        
        if tipo_elemento in tipo_elemento_dict and tipo_incidente.inhabilitar_elemento == True:
            modelo = tipo_elemento_dict[tipo_elemento]
            elemento = modelo.objects.get(id = elemento['id'])
            estado = Estado.objects.get(descripcion='Fuera de servicio')
            elemento.estado = estado
            elemento.save()
            print(f"\n{elemento}\n")
        
        incidente.save() 
        cambiar_estado_elemento(incidente.id)
        # response_cambiar_estado = requests.put(url=url_cambiar_estado_elemento)
        
        
        return Response({'message': f'incidente {pk} y estado de elemento actualizado'}, status=status.HTTP_200_OK)
    
    except Incidente.DoesNotExist:
        return Response({'message': 'incidente no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as error:
        return Response({'message': f'error inesperado {str(error)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_incidente(request, pk):
    try:
        incidente = Incidente.objects.get(id=pk)
        incidente.delete()
        return Response({'message': f'Incidente {pk} eliminado'}, status=status.HTTP_200_OK)
    except:
        return Response({'message': f'Incidente {pk} no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_historial_incidente(request, pk):
    try:
        historial = Incidente_operacion.objects.filter(incidente=pk)
        serializer = Incidente_operacion_serializer(historial, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({'message': f'Error al encontrar el historial para el incidente {pk}'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def post_incidente_operacion(request):
    serializer = Incidente_operacion_post_serializer(data=request.data)
    
    try:
        if serializer.is_valid():
            datos_recibidos = serializer.validated_data
            incidente = datos_recibidos['incidente']
            operacion = datos_recibidos['operacion']
            usuario = datos_recibidos['usuario']
            
            operaciones_incidente = Incidente_operacion.objects.filter(incidente=incidente.id).order_by('operacion').values_list('operacion', flat=True)
            
            if not operaciones_incidente:
                raise Exception("No se pueden agregar operaciones si no hay una operación anterior registrada.")
            
            if (operacion.id - 1 not in operaciones_incidente):
                raise Exception("No se pueden saltear operaciones, debe haber una operación anterior registrada.")

            if operacion.id in operaciones_incidente:
                raise Exception("No se puede generar un movimiento que ya asignado al incidente")

            incidente_operacion = Incidente_operacion.objects.create(
                incidente=incidente,
                operacion=operacion,
                usuario=usuario
            )
            
            incidente.estado_incidente = operacion
            incidente.save()
            
            cambiar_estado_elemento(incidente.id)
            
            print(f"\nINCIDENTE: {incidente.estado_incidente}\n")
            
            response = Incidente_operacion_serializer(incidente_operacion, many=False)
            
            return Response(response.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "datos invalidos", "error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    except serializers.ValidationError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({"detail": f"Error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['PUT'])
def cambiar_estado_elemento(incidente_id):
    incidente = Incidente.objects.get(id=incidente_id)
    elemento = None

    # Determinar el elemento relacionado con el incidente
    if incidente.cisterna:
        elemento = Cisterna.objects.get(id=incidente.cisterna.id)
    elif incidente.copa:
        elemento = Copa.objects.get(id=incidente.copa.id)
    elif incidente.pozo:
        elemento = Pozo.objects.get(id=incidente.pozo.id)
    elif incidente.bateria:
        elemento = Bateria.objects.get(id=incidente.bateria.id)
    elif incidente.punto_interno:
        elemento = Punto_interno.objects.get(id=incidente.punto_interno.id)
    elif incidente.bomba:
        elemento = Bomba.objects.get(id=incidente.bomba.id)

    # Verificar si se encontró un elemento
    if not elemento:
        raise ValueError("No se encontró un elemento relacionado con el incidente.")

    # Cambiar el estado del elemento según las condiciones
    if not incidente.tipo_incidente.inhabilitar_elemento:
        print(f"SE DEBE HABILITAR EL ELEMENTO")
        elemento.estado = Estado.objects.get(descripcion='En funcionamiento')
    
    if incidente.tipo_incidente.inhabilitar_elemento:
        print(f"SE DEBE INHABILITAR EL ELEMENTO")
        elemento.estado = Estado.objects.get(descripcion='Fuera de servicio')
        
    if incidente.estado_incidente.descripcion_operacion == 'Trabajando':
        print(f"\nSE DEBE PONER EL ELEMENTO EN REPARACIÓN\n")
        elemento.estado = Estado.objects.get(descripcion='En reparacion')
            
    if incidente.estado_incidente.descripcion_operacion == 'Solucionado':
        print(f"\nSE DEBE PONER EL ELEMENTO EN FUNCIONAMIENTO\n")
        elemento.estado = Estado.objects.get(descripcion='En funcionamiento')
    
    # else: 
    #     elemento.estado = Estado.objects.get(descripcion='En funcionamiento')
    
    # elif :
    #     print(f"\nSE DEBE PONER EL ELEMENTO EN REPARACIÓN\n")
    #     elemento.estado = Estado.objects.get(descripcion='En reparacion')

    # Guardar el cambio de estado
    elemento.save()
    return Response({'message': f'estado del elemento {elemento.estado.descripcion}'}, status=status.HTTP_200_OK)