# Generated by Django 4.0.4 on 2022-09-12 14:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('examples', '0008_example_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='example',
            name='type',
        ),
    ]
