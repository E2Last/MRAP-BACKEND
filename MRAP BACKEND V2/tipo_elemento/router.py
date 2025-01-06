from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Tipo_de_elemento_view
#from .api import usos_de_la_bomba

# Configuración del router
router = DefaultRouter()
router.register(r'tipo_de_elemento', Tipo_de_elemento_view)

# Definición de las URLs
tipo_de_elemento_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
    #path('bomba/usos/<int:pk>/', usos_de_la_bomba, name='usos_de_la_bomba')
]
