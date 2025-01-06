from django.urls import path
from usuario.api import Register_view
from usuario.api import Perfil_usuario_view
from usuario.api import Usuario_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

usuario_urlpatterns = [
   path('usuario/register', Register_view.as_view(), name='register'),
   path('usuario/login', TokenObtainPairView.as_view(), name='login'),
   path('usuario/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
   path('usuario', Usuario_view.as_view({'post': 'create'}), name='usuario_create'),  # Crear usuario
   path('usuario/all', Usuario_view.as_view({'get': 'list'}), name='usuario_list'),  # Obtener todos los usuarios
   
   path('usuario/username/<str:username>', Usuario_view.as_view({'get': 'get_usuario_by_username'}), name='get_usuario_by_username'),  # Obtener usuario por nombre
   path('usuario/id/<str:pk>', Usuario_view.as_view({'get': 'get_usuario_by_pk'}), name='get_usuario_by_pk'),  # Obtener usuario por nombre
]
