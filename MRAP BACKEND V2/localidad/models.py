from django.db import models

# Create your models here.
class Localidad(models.Model):
    nombre = models.CharField(max_length=200)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        db_table='localidad'