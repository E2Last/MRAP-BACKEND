# Generated by Django 5.1.1 on 2024-09-16 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tipo_elemento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_tipo_de_elemento', models.CharField(max_length=200)),
            ],
            options={
                'db_table': 'tipo_elemento',
            },
        ),
    ]
