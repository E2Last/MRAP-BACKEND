from rest_framework.routers import DefaultRouter
from django.urls import path, include
# from .api import post_control
from .api import Control_view
from .api import Tipo_control_view
from .api import Valores_control_view
from .api import post_control
from .api import put_control
from .api import get_control
from .api import get_control_historico

router = DefaultRouter()
router.register(r'control', Control_view, basename='control')
router.register(r'tipo_control', Tipo_control_view, basename='tipo_control')
router.register(r'valores_control', Valores_control_view, basename='valores_control')

rutas = [
    path('post/', post_control, name='post_control'),
    path('put/<int:id>/', put_control, name='put_control'),
    path('get/<int:id>/', get_control, name='get_control'),
    path('get-control-historico/<int:punto_control_id>/<int:tipo_control_id>/<int:rango_meses>/', get_control_historico, name='get_control_historico')
]

control_urlpatterns = [
    path('control/', include(router.urls)),
    path('control/', include(rutas))
]