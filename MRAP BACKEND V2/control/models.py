from django.db import models
from usuario.models import Usuario
from punto_control.models import Punto_de_control
from analisis.models import Analisis
from proveedor.models import Proveedor
from analisis.models import Parametro, Analisis
# Create your models here.

class Tipo_control(models.Model):
    tipo_control = models.CharField(max_length=50)
    
    def __str__(self):
        return f'{self.tipo_control}'

class Control(models.Model):
    aprobado = models.BooleanField(default=False)
    punto_de_control = models.ForeignKey(Punto_de_control, on_delete=models.CASCADE, null=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    fecha = models.DateField()
    hora = models.TimeField(auto_now_add=True, null=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True)
    analisis = models.ForeignKey(Analisis, on_delete=models.CASCADE, null=False)
    tipo_control = models.ForeignKey(Tipo_control, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.punto_de_control}'
    
    class Meta:
        db_table = 'control'
    
class Valores_control(models.Model):
    control = models.ForeignKey(Control, on_delete=models.CASCADE)
    fecha = models.DateField(null=True)
    hora = models.TimeField(null=True)
    analisis = models.ForeignKey(Analisis, on_delete=models.CASCADE)
    parametro = models.ForeignKey(Parametro, on_delete=models.CASCADE)
    valor = models.CharField(max_length=50, default=0)
    tipo_control = models.ForeignKey(Tipo_control, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'valores_control'