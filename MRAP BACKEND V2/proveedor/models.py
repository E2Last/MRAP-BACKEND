from django.db import models

# Create your models here.
class Proveedor(models.Model):
    codigo_proveedor = models.CharField(max_length=30)
    nombre_proveedor = models.CharField(max_length=250)
    
    class Meta:
        db_table = 'proveedor'
        
    def __str__(self):
        return f'nombre: {self.nombre_proveedor} | codigo {self.codigo_proveedor}'