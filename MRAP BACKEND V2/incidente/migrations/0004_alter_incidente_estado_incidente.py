# Generated by Django 5.1.1 on 2024-09-18 11:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incidente', '0003_incidente_tipo_incidente'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incidente',
            name='estado_incidente',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='incidente.operacion'),
        ),
    ]
