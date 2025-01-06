from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Copa_view
#from .api import usos_de_la_bomba

# Configuración del router
router = DefaultRouter()
router.register(r'copa', Copa_view)

# Definición de las URLs
copa_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
]
