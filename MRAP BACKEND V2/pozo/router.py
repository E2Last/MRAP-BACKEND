from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Pozo_view

# Configuración del router
router = DefaultRouter()
router.register(r'pozo', Pozo_view)

# Definición de las URLs
pozo_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
]