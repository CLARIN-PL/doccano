# Generated by Django 4.0.4 on 2022-09-21 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('examples', '0013_rename_text_type_example_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='example',
            name='article_id',
            field=models.CharField(blank=True, max_length=1049),
        ),
    ]
