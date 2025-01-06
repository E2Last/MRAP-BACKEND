from rest_framework.routers import DefaultRouter
from django.urls import path
# from .api import Incidente_operacion_view
from .api import Gravedad_incidente_view
from .api import Tipo_incidente_view
from .api import Operacion_view
from .api import Incidente_view
from .api import post_incidente_operacion
from .api import get_incidente
from .api import put_incidente
from .api import delete_incidente
from .api import get_historial_incidente
from .api import cambiar_estado_elemento

router = DefaultRouter()
# router.register(r'incidente/incidente_operacion', post_incidente_operacion)
router.register(r'incidente/gravedad', Gravedad_incidente_view)
router.register(r'incidente/tipo_incidente', Tipo_incidente_view)
# router.register(r'incidente/operaciones', Operacion_view)
# router.register(r'incidente', Incidente_view)

incidente_operacion_urlpatterns = [
    *router.urls,  # Incluye las URLs del router
    path('incidente/', Incidente_view.as_view(), name='incidente'),
    path('incidente/<int:pk>/', get_incidente, name='get_incidente'),
    path('incidente/<int:pk>/update/', put_incidente, name='put_incidente'),
    path('incidente/<int:pk>/delete/', delete_incidente, name='delete_incidente'),
    path('incidente/historial/<int:pk>/', get_historial_incidente, name='get_historial_incidente'),
    path('incidente/operacion/', post_incidente_operacion, name='post_incidente_operacion'),
    path('incidente/<int:incidente_id>/cambiar_estado/', cambiar_estado_elemento, name='put_cambiar_estado'),
]