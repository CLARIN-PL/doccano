# Generated by Django 4.0.4 on 2022-09-28 09:42

from django.db import migrations, models

def populate_questions(apps, schema_editor):
    question_list = [
        "Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)",
        "Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst?",
        "Czego życzę autorowi tego tekstu?",
        "Płeć którą?",
        "Narodowość którą?",
        "Przekonania religijne jakie?",
        "Rasę, kolor skóry którą?",
        "Orientację seksualną jaką?",
        "Poglądy polityczne jakie?",
        "Inne, np. grupy społeczne, zawodowe jakie?",
        "Inne",
        "Płeć którą?",
        "Narodowość którą?",
        "Przekonania religijne jakie?" ,
        "Rasę, kolor skóry którą?",
        "Orientację seksualną jaką?",
        "Poglądy polityczne jakie?",
        "Inne (np. grupy społeczne, zawodowe) jakie?",
    ]
    annotation_modes = [
        "summary",
        "summary",
        "emotions",
        "offensiveness",
        "offensiveness",
        "offensiveness",
        "offensiveness",
        "offensiveness",
        "offensiveness",
        "offensiveness",
        "offensiveness",
        "humor",
        "humor",
        "humor",
        "humor",
        "humor",
        "humor",
        "humor",
    ]
    Question = apps.get_model('questions', 'Question')
    for i in range(len(question_list)):
        object = Question(question_text=question_list[i], annotation_mode=annotation_modes[i])
        object.save()

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.CharField(max_length=200)),
                ('annotation_mode', models.CharField(max_length=200)),
            ],
        ),
        migrations.RunPython(populate_questions),
    ]
