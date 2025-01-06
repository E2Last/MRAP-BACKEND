from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Punto_interno_view

# Configuración del router
router = DefaultRouter()
router.register(r'punto_interno', Punto_interno_view)

# Definición de las URLs
punto_interno_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
]