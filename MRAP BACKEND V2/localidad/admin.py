from django.contrib import admin
from .models import Localidad
# Register your models here.
@admin.register(Localidad)
class Bomba_usos_admin(admin.ModelAdmin):
    fields_list=['id','nombre']