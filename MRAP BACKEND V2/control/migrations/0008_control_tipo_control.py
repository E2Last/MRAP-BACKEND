# Generated by Django 5.1.1 on 2024-12-09 15:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('control', '0007_alter_control_fecha'),
    ]

    operations = [
        migrations.AddField(
            model_name='control',
            name='tipo_control',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, to='control.tipo_control'),
            preserve_default=False,
        ),
    ]
