from django.db import models
from estado.models import Estado
from bateria.models import Bateria
from bomba.models import Bomba
from tipo_elemento.models import Tipo_elemento
# Create your models here.

class Caudal(models.Model):
    caudal_total = models.FloatField(default=0.0)
    
    # ver que se descuenten los caudales de pozos inactivos, fuera de servicio, etc...
    def actualizar_caudal(self):
        self.caudal_total = sum( pozo.caudal for pozo in self.pozos.filter(estado="En funcionamiento") )
        self.save()
    
    def __str__(self):
        return f"Caudal total: {self.caudal_total}"

    class Meta:
        db_table = "caudal"
    
class Pozo(models.Model):
    caudal = models.FloatField(default=0.0)
    caudal_total = models.ForeignKey(Caudal, on_delete=models.CASCADE, related_name='pozos', default=1)
    
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE, related_name='pozo')
    nombre_pozo = models.CharField(max_length=250)
    tipo_elemento = models.ForeignKey(Tipo_elemento, on_delete=models.CASCADE)
    bateria = models.ForeignKey(Bateria, on_delete=models.CASCADE, related_name='pozos')
    bomba = models.ForeignKey(Bomba, on_delete=models.CASCADE, related_name='pozo')
    latitud = models.FloatField()
    longitud = models.FloatField()
    
    class Meta:
        db_table='pozo'
        
    def __str__(self):
        return self.nombre_pozo