#!/usr/bin/env bash

set -o errexit  # Salir inmediatamente si un comando falla

# Moverse al directorio donde se encuentra manage.py
cd "MRAP BACKEND V2"

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar comandos de Django
python manage.py collectstatic --noinput
python manage.py migrate
