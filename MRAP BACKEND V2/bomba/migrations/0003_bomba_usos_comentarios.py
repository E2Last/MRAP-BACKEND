# Generated by Django 5.1.1 on 2024-12-04 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bomba', '0002_bomba_tipo_elemento'),
    ]

    operations = [
        migrations.AddField(
            model_name='bomba_usos',
            name='comentarios',
            field=models.TextField(blank=True, max_length=200, null=True),
        ),
    ]
