# Generated by Django 5.1.1 on 2024-12-09 10:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analisis', '0006_alter_intervalo_referencia_alto_and_more'),
        ('control', '0007_alter_control_fecha'),
    ]

    operations = [
        migrations.AddField(
            model_name='analisis',
            name='tipo_control',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='control.tipo_control'),
            preserve_default=False,
        ),
    ]
