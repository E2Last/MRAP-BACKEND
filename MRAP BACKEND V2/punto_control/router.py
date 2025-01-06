from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Punto_control_view

# Configuración del router
router = DefaultRouter()
router.register(r'punto_de_control', Punto_control_view)

# Definición de las URLs
punto_control_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
]