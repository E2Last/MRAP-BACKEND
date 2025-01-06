# Generated by Django 5.1.1 on 2024-10-29 14:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('incidente', '0018_remove_incidente_content_type_and_more'),
        ('tipo_elemento', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='incidente',
            name='content_type',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'),
        ),
        migrations.AddField(
            model_name='incidente',
            name='object_id',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='incidente',
            name='tipo_elemento',
            field=models.ForeignKey(default=3, on_delete=django.db.models.deletion.CASCADE, to='tipo_elemento.tipo_elemento'),
        ),
    ]
