# Generated by Django 5.1.1 on 2024-11-13 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incidente', '0031_alter_incidente_descripcion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incidente',
            name='descripcion',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]
