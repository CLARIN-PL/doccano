# Generated by Django 4.0.4 on 2022-10-26 08:45

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('examples', '0018_exampleannotatestartstate'),
    ]

    operations = [
        migrations.RenameField(
            model_name='exampleannotatestartstate',
            old_name='start_by',
            new_name='started_by',
        ),
        migrations.AlterUniqueTogether(
            name='exampleannotatestartstate',
            unique_together={('example', 'started_by')},
        ),
    ]
