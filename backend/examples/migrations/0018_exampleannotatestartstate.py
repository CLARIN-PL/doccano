# Generated by Django 4.0.4 on 2022-10-25 22:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('examples', '0017_remove_examplestate_started_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExampleAnnotateStartState',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('started_at', models.DateTimeField(auto_now=True)),
                ('example', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='annotate_start_states', to='examples.example')),
                ('start_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('example', 'start_by')},
            },
        ),
    ]
