# Generated by Django 5.1.1 on 2024-09-18 13:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pozo', '0001_initial'),
        ('tipo_elemento', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pozo',
            name='tipo_elemento',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='tipo_elemento.tipo_elemento'),
            preserve_default=False,
        ),
    ]
