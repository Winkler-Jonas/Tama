# Generated by Django 5.0.6 on 2024-05-24 01:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_task'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Task',
        ),
    ]