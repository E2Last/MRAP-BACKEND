from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Modelo para definir el perfil del usuario
class Perfil_usuario(models.Model):
    titulo_perfil = models.CharField(max_length=100)

    def __str__(self):
        return self.titulo_perfil

# Manager personalizado para el modelo de usuario
class Usuario_manager(BaseUserManager):
    def create_user(self, username, alias, dni, nombre, apellido, perfil, password=None):
        if not username:
            raise ValueError('El usuario debe tener un nombre de usuario.')

        # Crear la instancia del usuario
        usuario = self.model(
            username=username,
            alias=alias,
            dni=dni,
            nombre=nombre,
            apellido=apellido,
            perfil=perfil  # Asegúrate de pasar un objeto de Perfil_usuario
        )

        # Asignar la contraseña
        if password:
            usuario.set_password(password)

        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, username, alias, dni, nombre, apellido, perfil, password):
        if perfil is None:
            raise ValueError('El superusuario debe tener un perfil.')
        else:
            perfil = Perfil_usuario.objects.get(pk=perfil)

        # Crear el superusuario
        usuario = self.create_user(
            username=username,
            alias=alias,
            dni=dni,
            nombre=nombre,
            apellido=apellido,
            perfil=perfil,
            password=password
        )

        # Establecer permisos de superusuario
        usuario.is_staff = True
        usuario.is_superuser = True
        usuario.save(using=self._db)

        return usuario

# Modelo de usuario personalizado
class Usuario(AbstractUser):
    alias = models.CharField(max_length=50, unique=True)
    dni = models.IntegerField()
    nombre = models.CharField(max_length=250)
    apellido = models.CharField(max_length=250)
    perfil = models.ForeignKey(Perfil_usuario, on_delete=models.SET_NULL, null=True, default=None)
    usuario_activo = models.BooleanField(default=True)

    objects = Usuario_manager()

    USERNAME_FIELD = 'username'  # Cambiando el campo de nombre de usuario
    REQUIRED_FIELDS = ['alias', 'dni', 'nombre', 'apellido', 'perfil']  # Campos requeridos al crear superusuarios

    def __str__(self):
        return f'{self.username} {self.dni}'

    class Meta:
        db_table = 'usuario'
