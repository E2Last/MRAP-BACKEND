from rest_framework.serializers import PrimaryKeyRelatedField
from rest_framework import serializers
from usuario.models import Usuario, Perfil_usuario

class Usuario_serializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password', 'nombre', 'apellido', 'alias']
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class Perfil_usuario_serializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil_usuario
        fields = ['id','titulo_perfil']


class Post_usuario_serializer(serializers.ModelSerializer):
    perfil = PrimaryKeyRelatedField(queryset=Perfil_usuario.objects.all(),required=True)
    
    class Meta:
        model = Usuario
        fields = ['username','alias','dni','nombre','apellido','perfil','password'] 

          
class Usuario_public_info(serializers.ModelSerializer):
    perfil = Perfil_usuario_serializer()
    class Meta:
        model = Usuario
        fields = ['id', 'username','nombre','apellido', 'alias', 'perfil']
        
