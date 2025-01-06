from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Bateria_view

# Configuración del router
router = DefaultRouter()
router.register(r'bateria', Bateria_view)

# Definición de las URLs
bateria_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
]