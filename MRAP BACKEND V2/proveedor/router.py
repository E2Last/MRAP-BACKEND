from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Proveedor_view

# Configuración del router
router = DefaultRouter()
router.register(r'proveedor', Proveedor_view)

# Definición de las URLs
proveedor_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
]