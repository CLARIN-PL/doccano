# Generated by Django 4.0.4 on 2022-09-30 09:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_initial'),
        ('labels', '0015_textlabel_question'),
    ]

    operations = [
        migrations.AlterField(
            model_name='textlabel',
            name='question',
            field=models.ForeignKey(default=19, on_delete=django.db.models.deletion.CASCADE, to='questions.question'),
        ),
    ]
