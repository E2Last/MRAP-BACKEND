# Generated by Django 5.1.1 on 2024-10-31 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incidente', '0022_remove_incidente_content_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incidente',
            name='fecha_de_registro',
            field=models.DateField(auto_now_add=True),
        ),
    ]
