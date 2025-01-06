from django.db import models
# Create your models here.
class Tipo_elemento(models.Model):
    nombre_tipo_de_elemento = models.CharField(max_length=200)
    
    def __str__(self):
        return self.nombre_tipo_de_elemento
    
    class Meta:
        db_table = 'tipo_elemento'