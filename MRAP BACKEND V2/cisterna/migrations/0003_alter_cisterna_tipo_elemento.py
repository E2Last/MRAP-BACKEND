# Generated by Django 5.1.1 on 2024-10-02 11:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cisterna', '0002_cisterna_tipo_elemento'),
        ('tipo_elemento', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cisterna',
            name='tipo_elemento',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tipo_elemento.tipo_elemento'),
        ),
    ]
