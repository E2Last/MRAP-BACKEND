from django.db import models
from estado.models import Estado
from tipo_elemento.models import Tipo_elemento

# Create your models here.
class Punto_interno(models.Model):
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE, related_name='punto_interno')
    nombre_punto_interno = models.CharField(max_length=250) 
    tipo_elemento = models.ForeignKey(Tipo_elemento, on_delete=models.CASCADE)   
    latitud = models.FloatField()
    longitud = models.FloatField()
    
    class Meta:
        db_table = 'punto_interno'
    
    def __str__(self):
        return self.nombre_punto_interno