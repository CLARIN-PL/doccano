# Generated by Django 4.0.4 on 2022-09-12 14:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('examples', '0010_example_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='example',
            name='type',
        ),
    ]
