# Generated by Django 4.0.4 on 2022-09-29 14:25

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
        "Inne (W jaki sposób?)",
        "Płeć którą?",
        "Narodowość którą?",
        "Przekonania religijne jakie?" ,
        "Rasę, kolor skóry którą?",
        "Orientację seksualną jaką?",
        "Poglądy polityczne jakie?",
        "Inne (np. grupy społeczne, zawodowe) jakie?",
        "Pozytywne (Jakie?)",
        "Negatywne (Jakie?)",
        "Radość, szczęście?",
        "Zachwyt, podziw, duma?",
        "Podnosi na duchu, inspiruje?",
        "Spokój, relaks?",
        "Zaskoczenie, zdziwienie?",
        "Współczucie?",
        "Strach, niepokój?",
        "Smutek, nieszczęście?",
        "Wstręt, obrzydzenie?",
        "Złość, wkurzenie, gniew, irytacja?",
        "Ironiczny, sarkastyczny? (Jaki jest ten tekst?)",
        "Żenujący? (Jaki jest ten tekst?)",
        "Wulgarny? (Jaki jest ten tekst?)",
        "Polityczny? (Jaki jest ten tekst?)",
        "Interesujący, ciekawy? (Jaki jest ten tekst?)",
        "Zrozumiały? (Jaki jest ten tekst?)",
        "Zgadzam się z tekstem? (Jaki jest ten tekst?",
        "Wierzę w tę informację? (Jaki jest ten tekst?)",
        "Potrzebuję więcej informacji, aby ocenić ten tekst? (Jaki jest ten tekst?)",
        "Obraża mnie?",
        "Może kogoś atakować / obrażać / lekceważyć?",
        "Odczłowieczenie? (W jaki sposób?)",
        "Mowa nienawiści? (W jaki sposób?)",
        "Nawoływanie do przemocy? (W jaki sposób?)",
        "Nawoływanie do ludobójstwa? (W jaki sposób?)",
        "Niesprawiedliwe uogólnianie, stereotypy? (W jaki sposób?)",
        "Lekceważenie? (W jaki sposób?)",
        "Upokorzenie? (W jaki sposób?)",
        "Mnie bawi/śmieszy?",
        "Może kogoś bawić?",
        "czarny humor?",
        "ironię?",
        "sarkazm?",
        "dwuznaczność?",
        "grę słów?",
        "seksualność?",
        "humor fekalny (o kupie :-) ) ?",
        "brzmienie słów?",
        "wyolbrzymienie?",
        "niecenzuralne słowa?",
        "kontrast?",
        "ma charakter dowcipu, kawału, żartu?"
    ]
    annotation_modes = [
        "summary",
        "summary",
        "others",
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
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "emotions",
        "others",
        "others",
        "others",
        "others",
        "others",
        "others",
        "others",
        "others",
        "others",
        "offensiveness",
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
        "humor",
        "humor",
        "humor",
        "humor",
        "humor",
        "humor",
        "humor"
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
                ('question_text', models.CharField(max_length=1024)),
                ('annotation_mode', models.CharField(max_length=200)),
            ],
        ),
        migrations.RunPython(populate_questions),
    ]
