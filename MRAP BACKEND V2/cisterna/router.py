from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Cisterna_view
#from .api import usos_de_la_bomba

# Configuración del router
router = DefaultRouter()
router.register(r'cisterna', Cisterna_view)

# Definición de las URLs
cisterna_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
]
