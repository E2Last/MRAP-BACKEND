from django.db import models
from tipo_elemento.models import Tipo_elemento
# from control.models import Tipo_control
# Create your models here.

class Unidad(models.Model):
    codigo = models.CharField(max_length=50)
    nombre_unidad = models.CharField(max_length=50)
    
    class Meta:
        db_table = 'unidad'
        
    def __str__(self):
        return f'{self.codigo}, {self.nombre_unidad}'

    class Meta:
        db_table='unidad'

class Parametro(models.Model):
    parametro_codigo = models.CharField(max_length=50)
    nombre_parametro = models.CharField(max_length=200)
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE)
    texto = models.BooleanField(default=False)
    numero = models.BooleanField(default=False)
    decimales = models.IntegerField(default=0)
    # analisis = models.ForeignKey('Analisis', on_delete=models.CASCADE, null=True, blank=True, related_name='parametros_de_analisis')
    
    def __str__(self):
        return f'({self.id}) {self.nombre_parametro}'

    class Meta:
        db_table='parametro'

class Intervalo_referencia(models.Model):
    # elementos
    tipo_elemento = models.ForeignKey(Tipo_elemento, on_delete=models.CASCADE)
    
    parametro = models.ForeignKey(Parametro, on_delete=models.CASCADE)
    # unidad = models.OneToOneField(Unidad, on_delete=models.CASCADE)
    muy_bajo = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    bajo = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    alto = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    muy_alto = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    muy_bajo_regex = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    bajo_regex = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    alto_regex = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    muy_alto_regex = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    
    class Meta:
        db_table='intervalo_referencia'

class Periodicidad(models.Model):
    periodicidad_codigo = models.CharField(max_length=50)
    periodicidad_nombre = models.CharField(max_length=250)
    numero_dias = models.IntegerField()
    retraso_dias = models.IntegerField()
    muy_retrasado_dias = models.IntegerField()
    
    def __str__(self):
        return f'[{self.periodicidad_codigo}] {self.periodicidad_nombre}'
    
    class Meta:
        db_table='periodicidad'

class Analisis(models.Model):
    nombre = models.CharField(max_length=100)
    parametros = models.ManyToManyField(Parametro, related_name='analisis_parametros')
    tipo_control = models.ForeignKey('control.Tipo_control', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        db_table='analisis'

class Periodo_analisis_elemento(models.Model):
    tipo_elemento = models.ForeignKey(Tipo_elemento, on_delete=models.CASCADE)
    analisis = models.ForeignKey(Analisis, on_delete=models.CASCADE)
    periodo = models.ForeignKey(Periodicidad, on_delete=models.CASCADE)
    # probando
    class Meta:
        db_table='periodo_analisis_elemento'