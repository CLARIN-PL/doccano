# Generated by Django 4.0.4 on 2023-03-13 18:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0012_rename_value_dimensionmetadata_config_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='projectdimension',
            unique_together={('project', 'dimension')},
        ),
    ]
