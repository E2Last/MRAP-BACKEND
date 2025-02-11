# Generated by Django 5.1.1 on 2024-10-29 13:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('incidente', '0016_remove_incidente_content_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='incidente',
            name='content_type',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='incidente',
            name='object_id',
            field=models.PositiveIntegerField(default=None),
            preserve_default=False,
        ),
    ]
