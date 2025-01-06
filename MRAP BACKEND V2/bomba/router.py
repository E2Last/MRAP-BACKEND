from rest_framework.routers import DefaultRouter
from django.urls import path
from .api import Bomba_view, Bomba_usos_view
#from .api import usos_de_la_bomba

# Configuración del router
router = DefaultRouter()
router.register(r'bomba', Bomba_view)
#router.register(r'bomba/usos', Bomba_usos_view)
router.register(r'usos', Bomba_usos_view)

# Definición de las URLs
bomba_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
    #path('bomba/usos/<int:pk>/', usos_de_la_bomba, name='usos_de_la_bomba')
]
