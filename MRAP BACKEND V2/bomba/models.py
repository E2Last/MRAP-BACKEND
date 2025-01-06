from django.db import models
from estado.models import Estado
from tipo_elemento.models import Tipo_elemento
# Create your models here.
class Bomba(models.Model):
    estado=models.ForeignKey(Estado,on_delete=models.CASCADE,null=True, related_name='bomba')
    nombre_bomba=models.CharField(max_length=150)
    tipo_elemento = models.ForeignKey(Tipo_elemento, on_delete=models.CASCADE)
    latitud = models.FloatField(default=0, null=True, blank=True)
    longitud = models.FloatField(default=0, null=True, blank=True)
    
    def __str__(self):
        return f'{self.nombre_bomba}'
    
    class Meta:
        db_table='bomba'
        
class Bomba_usos(models.Model):
    fecha_de_uso=models.DateField()
    horas_de_uso=models.IntegerField()
    bomba=models.ForeignKey(Bomba,on_delete=models.CASCADE, related_name='bomba')
    # usuario
    comentarios = models.TextField(max_length=200, null=True, blank=True)
    
    def __str__(self):
        return f'bomba: {self.bomba.id} | fecha: {self.fecha_de_uso} | horas: {self.horas_de_uso}'
    
    class Meta:
        db_table='bomba_usos'