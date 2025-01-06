from usuario.models import Usuario, Perfil_usuario
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from usuario.serializer import Usuario_serializer
from usuario.serializer import Post_usuario_serializer
from usuario.serializer import Perfil_usuario_serializer
from usuario.serializer import Usuario_public_info
from django.shortcuts import get_object_or_404
# TOKEN
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

class Register_view(APIView):    
    def post(self, request):
        serializer = Usuario_serializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            # guardo el usario
            serializer.save()

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
class Perfil_usuario_view(ModelViewSet):
    queryset = Perfil_usuario.objects.all()
    serializer_class = Perfil_usuario_serializer
    
class Usuario_view(ModelViewSet):
    queryset = Usuario.objects.all()
    
    def get_usuario_by_username(self, request, username):
        try:
            usuario = Usuario.objects.get(username=username)
            serializer = Usuario_public_info(usuario)  # 'many=False' es por defecto, así que puedes omitirlo
            return Response(serializer.data)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_usuario_by_pk(self, request, pk):
        usuario = get_object_or_404(Usuario, pk=pk)  # Maneja el 404 automáticamente
        serializer = Usuario_public_info(usuario)  # 'many=False' es por defecto, así que puedes omitirlo
        return Response(serializer.data)
    
    def get_serializer_class(self):
        # Usa el serializador adecuado según la acción
        if self.action in ['create', 'update']:
            return Post_usuario_serializer
        return Usuario_public_info



"""
@api_view(['POST'])
def login(request):
    
    serializer = Usuario_login_serializer(data=request.data)
    
    if serializer.is_valid():
        username = serializer.data['username']
        password = serializer.data['password']
        
        user = authenticate(username=username, password=password)
        
        # scheck_password es una funcion que retorna true o false
        if user is not None:
            token = Token.objects.create()
        
            return Response(
                {"token": token, "usuario": user.username},
                status=status.HTTP_200_OK
            )
        return Response(
            {"error": "credenciales invalidas"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    return Response(
        serializer.errors, 
        status=status.HTTP_400_BAD_REQUEST
    )
        
class Usuario_apiview(APIView):
    
    def post(self, request):
        # contiene toda la informacion del usuario
        serializer = Usuario_serializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user = Usuario.objects.get(username=serializer.data['username'])
            user.set_password(serializer.data['password'])
            user.save()
            
            token = Token.objects.create(user=user)
            
            return Response(
                {
                    'token': token.key, 
                    'usuario': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
            #return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def login(self, request):
        # Usamos el LoginSerializer
        serializer = Usuario_login_serializer(data=request.data)
        
        if serializer.is_valid():
            #user = get_object_or_404(request, username=request.data['username'], password=request.data['password'])
            username = serializer.data['username']
            password = serializer.data['password']
            
            user = Usuario.objects.get(username=username)
            
            if user is not None and user.password == password:
                token = Token.objects.get_or_create(usuario=user)
                
                return Response(
                    {
                        'token': token.key,
                        'usuario': serializer.data
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "error": "credenciales invalidas"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(serializer.errors)            
    """