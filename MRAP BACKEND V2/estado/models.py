from django.db import models

# Create your models here.
class Estado(models.Model):
    descripcion=models.CharField(max_length=100)

    def __str__(self):
        return f'{self.descripcion}'

    class Meta:
        db_table='estado'