from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from punto_control.models import Punto_de_control
from usuario.models import Usuario
from bomba.models import Bomba
from bateria.models import Bateria
from cisterna.models import Cisterna
from copa.models import Copa
from pozo.models import Pozo
from estado.models import Estado
from punto_interno.models import Punto_interno
from tipo_elemento.models import Tipo_elemento

# Create your models here.

class Gravedad_incidente(models.Model):
    descripcion = models.CharField(max_length=250)

    def __str__(self):
        return self.descripcion
    
    class Meta:
        db_table = 'gravedad_incidente'

class Tipo_incidente(models.Model):
    descripcion_tipo_incidente = models.CharField(max_length=250)
    inhabilitar_elemento = models.BooleanField(default=False)
    
    def __str__(self):
        return self.descripcion_tipo_incidente

    class Meta:
        db_table = 'tipo_incidente'

class Operacion(models.Model):
    descripcion_operacion = models.CharField(max_length=250)
    
    def __str__(self):
        return self.descripcion_operacion
    
    class Meta:
        db_table = 'operacion'
        
class Incidente(models.Model):
    titulo = models.CharField(max_length=250)
    estado_incidente = models.ForeignKey(Operacion, on_delete=models.CASCADE, default=1)
    fecha_incidente = models.DateField()
    gravedad = models.ForeignKey(Gravedad_incidente, on_delete=models.CASCADE)
    
    tipo_elemento = models.ForeignKey(Tipo_elemento, on_delete=models.CASCADE)
    
    cisterna = models.ForeignKey(Cisterna, on_delete=models.CASCADE, null=True, blank=True)
    copa = models.ForeignKey(Copa, on_delete=models.CASCADE, null=True, blank=True)
    # punto_de_control = models.ForeignKey(Punto_de_control, on_delete=models.CASCADE, null=True, blank=True)
    pozo = models.ForeignKey(Pozo, on_delete=models.CASCADE, null=True, blank=True)
    bateria = models.ForeignKey(Bateria, on_delete=models.CASCADE, null=True, blank=True)
    bomba = models.ForeignKey(Bomba, on_delete=models.CASCADE, null=True, blank=True)
    punto_interno = models.ForeignKey(Punto_interno, on_delete=models.CASCADE, null=True, blank=True)
    
    fecha_de_registro = models.DateField(auto_now_add=True)
    tipo_incidente = models.ForeignKey(Tipo_incidente, on_delete=models.CASCADE)
    
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, null=False, blank=False)
    descripcion = models.TextField(blank=True, null=True, default="")   
    
    def __str__(self):
        return f'{self.titulo}'
    
    class Meta:
        db_table = 'incidente'
    
class Incidente_operacion(models.Model):
    incidente = models.ForeignKey(Incidente, on_delete=models.CASCADE)
    operacion = models.ForeignKey(Operacion, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, null=False)  
    fecha = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.incidente} {self.operacion} {self.usuario} {self.fecha}'
    
    class Meta:
        db_table = 'incidente_operacion'