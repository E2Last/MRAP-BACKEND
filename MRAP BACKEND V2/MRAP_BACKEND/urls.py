"""
URL configuration for MRAP project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# RUTAS DE LAS APPS
schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

from localidad.router import localidad_urlpatterns
#from punto_de_control.API_BOMBA.router import bomba_urlpatterns
#from punto_de_control.API_BOMBA.router import bomba_usos_urlpatterns
from bomba.router import bomba_urlpatterns
from estado.router import estado_urlpatterns
from cisterna.router import cisterna_urlpatterns
from copa.router import copa_urlpatterns
from pozo.router import pozo_urlpatterns
from bateria.router import bateria_urlpatterns
from punto_interno.router import punto_interno_urlpatterns
from proveedor.router import proveedor_urlpatterns
from usuario.router import usuario_urlpatterns
from incidente.router import incidente_operacion_urlpatterns
from analisis.router import analisis_urlpatterns
from tipo_elemento.router import tipo_de_elemento_urlpatterns
from punto_control.router import punto_control_urlpatterns
from control.router import control_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    # RUTAS DE LAS APPS
    path('MRAP/',include(localidad_urlpatterns) ),
    path('MRAP/',include(bomba_urlpatterns) ),
    path('MRAP/',include(estado_urlpatterns) ),
    path('MRAP/',include(cisterna_urlpatterns) ),
    path('MRAP/',include(copa_urlpatterns) ),
    path('MRAP/',include(pozo_urlpatterns) ),
    path('MRAP/',include(bateria_urlpatterns) ),
    path('MRAP/',include(punto_interno_urlpatterns) ),
    path('MRAP/',include(proveedor_urlpatterns) ),
    path('MRAP/', include(usuario_urlpatterns)),
    path('MRAP/', include(incidente_operacion_urlpatterns)),
    path('MRAP/', include(analisis_urlpatterns)),
    path('MRAP/', include(tipo_de_elemento_urlpatterns)),
    path('MRAP/', include(punto_control_urlpatterns)),
    path('MRAP/', include(control_urlpatterns)),
    # JWT
    path('MRAP/api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('MRAP/api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]