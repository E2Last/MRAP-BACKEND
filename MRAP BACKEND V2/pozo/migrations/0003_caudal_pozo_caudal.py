# Generated by Django 5.1.4 on 2024-12-23 10:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pozo', '0002_pozo_tipo_elemento'),
    ]

    operations = [
        migrations.CreateModel(
            name='Caudal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caudal_total', models.FloatField(default=0.0)),
            ],
        ),
        migrations.AddField(
            model_name='pozo',
            name='caudal',
            field=models.FloatField(default=0.0),
        ),
    ]
