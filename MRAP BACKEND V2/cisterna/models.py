from django.db import models
from estado.models import Estado
from localidad.models import Localidad
from tipo_elemento.models import Tipo_elemento
# Create your models here.
class Cisterna(models.Model):
    nombre_cisterna = models.CharField(max_length=200)
    tipo_elemento = models.ForeignKey(Tipo_elemento, on_delete=models.CASCADE)
    latitud = models.FloatField()
    longitud = models.FloatField()
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE, related_name='cisterna')
    localidad = models.ForeignKey(Localidad, on_delete=models.CASCADE, related_name='cisterna')
    
    def __str__(self):
        return self.nombre_cisterna
    
    class Meta:
        db_table='cisterna'