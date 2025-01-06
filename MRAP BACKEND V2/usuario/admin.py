from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from usuario.models import Usuario, Perfil_usuario
# Register your models here.
@admin.register(Usuario)
class Usuario_admin(BaseUserAdmin):
    fields_list = ['id','alias','nombre', 'apellido','password']
    list_display = ['id','alias','nombre', 'apellido','password']

@admin.register(Perfil_usuario)
class Perfil_admin(admin.ModelAdmin):
    list_display = ['id', 'titulo_perfil']