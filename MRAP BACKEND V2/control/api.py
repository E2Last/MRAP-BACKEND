from decimal import Decimal
from datetime import datetime
from dateutil.relativedelta import relativedelta
import arrow
from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from control.models import Control
from control.models import Tipo_control
from control.models import Valores_control
# from control.models import Punto_de_control
# from tipo_elemento.models import Tipo_elemento
from analisis.models import Intervalo_referencia
from .serializer import Control_get_serializer
from .serializer import Control_post_serializer
from .serializer import Tipo_control_serializer
from .serializer import Valores_control_get_serializer
from .serializer import Valores_control_post_serializer, Valores_control_put_serializer
# from punto_control.serializer import Punto_de_control_post_serializer

class Paginacion(PageNumberPagination):
    page_size = 10
    page_query_param = 'page'

class Control_view(ModelViewSet):
    queryset = Control.objects.all().order_by('-id')
    pagination_class = Paginacion
    
    def get_serializer_class(self):
        if self.action in ['create','update']:
            return Control_post_serializer
        return Control_get_serializer
    
class Tipo_control_view(ModelViewSet):
    queryset = Tipo_control.objects.all()
    serializer_class = Tipo_control_serializer

class Valores_control_view(ModelViewSet):
    queryset = Valores_control.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create','update']:
            return Valores_control_post_serializer
        return Valores_control_get_serializer

@api_view(['POST'])
def post_control(request):
    control_serializado = Control_post_serializer(data=request.data['control'])
    valores_control_serializados = Valores_control_post_serializer(data=request.data['valores_control'], many=True)
    
    if not control_serializado.is_valid():
        return Response(data=control_serializado.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if not valores_control_serializados.is_valid():
        return Response(data=valores_control_serializados.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data_control = control_serializado.validated_data
    data_valores = valores_control_serializados.validated_data
    
    try:
        # inicia la transaccion
        with transaction.atomic():
            # print(f'\n{data_control}\n')
            control = Control.objects.create(**data_control)
        
        for data in data_valores:
            nuevo_registro = Valores_control.objects.create(
                control=control,
                fecha=control.fecha,
                hora=control.hora,
                **data
            )
        evaluar_control(control)
        
        return Response(data={f"control {control.id} creado"}, status=status.HTTP_200_OK)
        
    except Exception as e:
        # se dispara el rollback
        return Response(data=str(e), status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def put_control(request, id):
    try:
        with transaction.atomic():
            # Actualización del control
            control_data = request.data.get('control') # para obtener los datos del control desde request
            
            if not control_data:
                return Response({'error': 'Faltan datos del control'}, status=status.HTTP_400_BAD_REQUEST)
            
            control_serializer = Control_post_serializer(data=control_data)
            if not control_serializer.is_valid():
                return Response(control_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            Control.objects.filter(id=id).update(**control_serializer.validated_data)
            
            # Actualización de valores de los parámetros del control
            valores_data = request.data.get('valores_control') # para obtener los valores de los parametros del contorl desde el request
            if not valores_data:
                return Response({'error': 'Faltan valores de control'}, status=status.HTTP_400_BAD_REQUEST)
            
            valores_serializer = Valores_control_put_serializer(data=valores_data, many=True)
            if not valores_serializer.is_valid():
                return Response(valores_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # todos los registros van coincidir en los campos "control", "parametro" y "analisis"
            control_id = valores_serializer.validated_data[0].get('control')
            analisis_id = valores_serializer.validated_data[0].get('analisis')
            tipo_control_id = valores_serializer.validated_data[0].get('tipo_control')
                
            registros = Valores_control.objects.filter(control=control_id, analisis=analisis_id, tipo_control=tipo_control_id).values_list('id', flat=True)
            
            for registro_id, registro in zip(registros, valores_serializer.validated_data):
                # print(f'\nregistro: {registro_id} de {registros} | parametro: {registro.get('parametro')} | valor: {registro.get('valor')}\n')
                valores_actualizados = Valores_control.objects.filter(id=registro_id).update(valor=registro['valor'])
            
            # print(f'\n{control_id}\n')
            evaluar_control(control_id)
           
        return Response({'message': 'Control actualizado'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Error en la actualización: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_control(request, id):
    try:
        control = Control.objects.get(id = id)
        control_serializado = Control_get_serializer(control)
        # print(f'\ncontrol[{id}]: {control_serializado.data}\n')
        
        parametros_control = Valores_control.objects.filter(control=control, analisis=control.analisis)
        parametros_control_serializados = Valores_control_get_serializer(parametros_control, many=True)
        # print(f'\nvalores control[{id}]: {parametros_control_serializados.data}\n')
        # print(f'\n{control_serializado.data}\n')
        response = {
            "control": control_serializado.data,
            "valores_control": parametros_control_serializados.data
        }
        
        return Response(data=response, status=status.HTTP_200_OK)
    except Control.DoesNotExist as e:
        return Response({f'{e}'}, status=status.HTTP_404_NOT_FOUND)
    
def evaluar_control(control):
    # ESTA FUNCION NECESITA UNA INSTANCIA DE CONTROL
    
    if control.punto_de_control.pozo is not None:
        tipo_de_elemento = control.punto_de_control.pozo.tipo_elemento.id
    
    if control.punto_de_control.copa is not None:
        tipo_de_elemento = control.punto_de_control.copa.tipo_elemento.id
    
    if control.punto_de_control.cisterna is not None:
        tipo_de_elemento = control.punto_de_control.cisterna.tipo_elemento.id
    
    if control.punto_de_control.bateria is not None:
        tipo_de_elemento = control.punto_de_control.bateria.tipo_elemento.id
        
    if control.punto_de_control.bomba is not None:
        tipo_de_elemento = control.punto_de_control.bomba.tipo_elemento.id
        
    if control.punto_de_control.punto_interno is not None:
        tipo_de_elemento = control.punto_de_control.punto_interno.tipo_elemento.id
    
    # PARAMETROS CON VALORES [{'parametro': 1, 'valor': '10'}, {'parametro': 1, 'valor': '15'}]
    valores_control = list(Valores_control.objects.filter(control=control).values('parametro', 'valor'))
    
    control_aprobado = True  # Por defecto, el control está aprobado
    
    if not control.tipo_control.tipo_control == 'Diario':
        for registro in valores_control:
            intervalo_de_referencia = Intervalo_referencia.objects.filter(
                tipo_elemento=tipo_de_elemento,
                parametro=registro['parametro'],
            ).first()

            print(f"\nTipo de elemento: {tipo_de_elemento} | Parámetro: {registro['parametro']} | Valor: {registro['valor']}")

            if intervalo_de_referencia:
                print(
                    f"bajo: {intervalo_de_referencia.bajo} | muy bajo: {intervalo_de_referencia.muy_bajo} | "
                    f"alto: {intervalo_de_referencia.alto} | muy alto: {intervalo_de_referencia.muy_alto}"
                )

                valor = Decimal(registro['valor'])

                # VERIFICAR CONDICIONES DE DESAPROBACIÓN
                if (
                    (intervalo_de_referencia.muy_alto is not None and valor > Decimal(intervalo_de_referencia.muy_alto)) or
                    (intervalo_de_referencia.alto is not None and valor > Decimal(intervalo_de_referencia.alto))
                ):
                    print(f"--- Valor fuera de rango ---")
                    control_aprobado = False
                    break
            else:
                print(f"No se encontró un intervalo de referencia para el parámetro: {registro['parametro']}")

        # ACTUALIZAR EL ESTADO DEL CONTROL
        control.aprobado = control_aprobado
        control.save()

        print(f"\n---- Resultado final del control: {'Aprobado' if control.aprobado else 'No aprobado'} ----\n")
    else:
        control.save()      
         
@api_view(['GET'])
def get_control_historico(request, punto_control_id, tipo_control_id, rango_meses):
    
    desde = arrow.now().date().replace(day=1) - relativedelta(months=rango_meses)
    hasta = arrow.now().date()
    
    print(f'\n{desde} | {hasta}\n')
    
    controles = list(Control.objects.filter(
        punto_de_control=punto_control_id,
        tipo_control=tipo_control_id,
        fecha__range=(desde, hasta)
    ).values('id','fecha','punto_de_control','tipo_control'))
    
    data_resultados = []
    data = []
    
    for control in controles:

        resultados = Valores_control.objects.filter(control=control['id'])
        
        for resultado in resultados:
            # print(f'parametro id: {resultado.parametro.id} | parametro codigo: {resultado.parametro.parametro_codigo} | valor: {resultado.valor} | fecha: {control['fecha']}')
            data_resultados.append({
                "fecha": control['fecha'],
                "parametro_id": resultado.parametro.id,
                "parametro_codigo": resultado.parametro.parametro_codigo,
                "valor": Decimal(resultado.valor)
            })
        
    data.append(
        {
            "punto_de_control": punto_control_id,
            "tipo_de_control": tipo_control_id,
            "resultados": data_resultados
        }
    )
    
    return Response(data=data, status=status.HTTP_200_OK)