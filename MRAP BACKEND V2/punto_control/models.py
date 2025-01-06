from django.db import models
from django.core.exceptions import ValidationError
from bomba.models import Bomba
from bateria.models import Bateria
from cisterna.models import Cisterna
from copa.models import Copa
from pozo.models import Pozo
from estado.models import Estado
from punto_interno.models import Punto_interno

class Punto_de_control(models.Model):
    # elementos
    pozo = models.OneToOneField(Pozo, on_delete=models.CASCADE, related_name='punto_control', null=True, blank=True)
    copa = models.OneToOneField(Copa, on_delete=models.CASCADE, related_name='punto_control', null=True, blank=True)
    cisterna = models.OneToOneField(Cisterna, on_delete=models.CASCADE, related_name='punto_control', null=True, blank=True)
    bateria = models.OneToOneField(Bateria, on_delete=models.CASCADE, related_name='punto_control', null=True, blank=True)
    bomba = models.OneToOneField(Bomba, on_delete=models.CASCADE, related_name='punto_control', null=True, blank=True)
    punto_interno = models.OneToOneField(Punto_interno, on_delete=models.CASCADE, related_name='punto_control', null=True, blank=True)
    
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE, related_name='punto_control')    
    nombre_punto_de_control = models.CharField(max_length=250)   
    # indica si hay que pausar las alertas de los retrasos 
    estado_retrasos = models.BooleanField(default=False)
    
    def clean(self):
        # Verificar que solo uno de los campos esté presente
        campos_con_valor = sum([self.pozo is not None, 
                                self.copa is not None, 
                                self.cisterna is not None, 
                                self.bateria is not None, 
                                self.bomba is not None, 
                                self.punto_interno is not None])
        if campos_con_valor == 0:
            raise ValidationError("Debe ingresar al menos uno de los siguientes campos: pozo, copa, cisterna, batería o bomba.")
        elif campos_con_valor > 1:
            raise ValidationError("Solo uno de los siguientes campos puede ser ingresado: pozo, copa, cisterna, batería o bomba.")

    def save(self, *args, **kwargs):
        # Ejecutar la validación personalizada antes de guardar
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        if self.pozo is not None:
            return f'punto de control de {self.pozo}'
        elif self.copa is not None:
            return f'punto de control de {self.copa}'
        elif self.cisterna is not None:
            return f'punto de control de {self.cisterna}'
        elif self.bateria is not None:
            return f'punto de control de {self.bateria}'
        elif self.bomba is not None:
            return f'punto de control de {self.bomba}'
        elif self.punto_interno is not None:
            return f'punto de control de {self.punto_interno}'
    
    class Meta:
        db_table='punto_control'
