from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .api import Unidad_view
from .api import Parametro_view
from .api import Periodicidad_view
from .api import Intervalo_referencia_view
from .api import Analisis_view
from .api import Periodo_analisis_elemento_view
# from .api import Control_view
from .api import parametros_sin_asignar
from .api import obtener_tabla_analisis
from .api import obtener_parametros_asociados
from .api import obtener_analisis_por_control
# Configuración del router
router = DefaultRouter()

# Rutas dependientes de análisis
router.register(r'unidad', Unidad_view)
router.register(r'parametro', Parametro_view)
router.register(r'periodicidad', Periodicidad_view)
router.register(r'intervalo_referencia', Intervalo_referencia_view)
router.register(r'periodos_analisis', Periodo_analisis_elemento_view)
# router.register(r'control', Control_view)
router.register(r'analisis', Analisis_view)

# Rutas personalizadas
rutas = [
    path('obtener_tabla/', obtener_tabla_analisis, name='obtener_tabla'),
    path('<int:pk>/parametros_sin_asignar/', parametros_sin_asignar,name='get_parametros_sin_asignar'),
    path('<int:pk>/parametros_asociados/', obtener_parametros_asociados, name='parametros_asociados'),
    path('control/<int:controlID>/', obtener_analisis_por_control, name='analisis_por_control')
]

# Definición de las URLs
analisis_urlpatterns = [
    path('analisis/', include(router.urls)),
    path('analisis/',include(rutas))
]