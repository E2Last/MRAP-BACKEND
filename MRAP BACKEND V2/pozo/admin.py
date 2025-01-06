from django.contrib import admin
from .models import Pozo
# Register your models here.
@admin.register(Pozo)
class Pozo_admin(admin.ModelAdmin):
    list_display=['id','nombre_pozo','bateria','bomba','latitud','longitud']