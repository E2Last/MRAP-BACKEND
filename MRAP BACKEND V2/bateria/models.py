from django.db import models
from tipo_elemento.models import Tipo_elemento
# Create your models here.

class Bateria(models.Model):
    nombre_bateria = models.CharField(max_length=250)
    latitud = models.FloatField()
    longitud = models.FloatField()
    tipo_elemento = models.ForeignKey(Tipo_elemento, on_delete=models.CASCADE, related_name='bateria')
    caudal_total = models.FloatField(default=0.0)
    
    def actualizar_caudal(self):
        self.caudal_total = sum( pozo.caudal for pozo in self.pozos.all() )
        # self.caudal_total.save()
        self.save()
        
    class Meta:
        db_table='bateria'
        
    def __str__(self):
        return self.nombre_bateria