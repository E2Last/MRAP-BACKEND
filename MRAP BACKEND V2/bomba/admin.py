from django.contrib import admin
from .models import Bomba, Bomba_usos
# Register your models here.
@admin.register(Bomba)
class Bomba_admin(admin.ModelAdmin):
    list_display=['id','estado','nombre_bomba','tipo_elemento','estado']
    
@admin.register(Bomba_usos)
class Bomba_usos_admin(admin.ModelAdmin):
    fields_list=['id','fecha_de_uso','horas_de_uso','bomba']