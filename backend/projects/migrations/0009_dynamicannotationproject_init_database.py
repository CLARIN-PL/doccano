from django.db import migrations, models
import django.db.models.deletion


def populate_dimensions(apps, schema_editor):
    dimensions = ['Pozytywne',
        'Negatywne',
        'Radość',
        'Zachwyt',
        'Inspiruje',
        'Spokój',
        'Zaskoczenie',
        'Współczucie',
        'Strach',
        'Smutek',
        'Wstręt',
        'Złość',
        'Ironiczny',
        'Żenujący',
        'Wulgarny',
        'Polityczny',
        'Interesujący',
        'Zrozumiały',
        'Zgadzam się z tekstem',
        'Wierzę w tę informację',
        'Potrzebuję więcej informacji, aby ocenić ten tekst',
        'Czuję sympatię do autora',
        'Nie wiem',
        'Nie mam życzeń',
        'Obraża mnie',
        'Może kogoś atakować / obrażać / lekceważyć',
        'Ze względu na co obraża - Płeć',
        'Ze względu na co obraża - Narodowość',
        'Ze względu na co obraża - Przekonania religijne',
        'Ze względu na co obraża - Rasę, kolor skóry, wygląd',
        'Ze względu na co obraża - Wiek',
        'Ze względu na co obraża - Czyn, działanie',
        'Ze względu na co obraża - Orientację seksualną',
        'Ze względu na co obraża - Poglądy polityczne, partie',
        'Ze względu na co obraża - Inne, np. grupy społeczne, zawodowe',
        'W jaki sposób? - Mowa nienawiści',
        'W jaki sposób? - Odczłowieczenie',
        'W jaki sposób? - Nawoływanie do przemocy',
        'W jaki sposób? - Nawoływanie do ludobójstwa',
        'W jaki sposób? - Niesprawiedliwe uogólnianie, stereotypy',
        'W jaki sposób? - Lekceważenie',
        'W jaki sposób? - Upokorzenie',
        'W jaki sposób? - Inne',
        'Bawi/śmieszny mnie',
        'Może kogoś bawić?',
        'Autor śmieje się z - Płeć',
        'Autor śmieje się z - Narodowość',
        'Autor śmieje się z - Przekonania religijne',
        'Autor śmieje się z - Rasę, kolor skóry, wygląd',
        'Autor śmieje się z - Wiek',
        'Autor śmieje się z - Czyn, działanie',
        'Autor śmieje się z - Orientację seksualną',
        'Autor śmieje się z - Poglądy polityczne, partie',
        'Autor śmieje się z - Inne, np. grupy społeczne, zawodowe',
        'Charakter humoru, śmieszy ze względu na - Czarny humor',
        'Charakter humoru, śmieszy ze względu na - Ironię',
        'Charakter humoru, śmieszy ze względu na - Sarkazm',
        'Charakter humoru, śmieszy ze względu na - Dwuznaczność',
        'Charakter humoru, śmieszy ze względu na - Grę słów',
        'Charakter humoru, śmieszy ze względu na - Seksualność',
        'Charakter humoru, śmieszy ze względu na - Humor fekalny (o kupie :-) )',
        'Charakter humoru, śmieszy ze względu na - Brzmienie słów',
        'Charakter humoru, śmieszy ze względu na - Wyolbrzymienie',
        'Charakter humoru, śmieszy ze względu na - Niecenzuralne słowa',
        'Charakter humoru, śmieszy ze względu na - Kontrast',
        'Charakter humoru, śmieszy ze względu na - Ma charakter dowcipu, kawału, żartu',
        'Charakter humoru, śmieszy ze względu na - Absurd',
        'Charakter humoru, śmieszy ze względu na - Humor sytuacyjny',
        'Charakter humoru, śmieszy ze względu na - Humor patetyczny']

    dimension_types = ["slider"]*22 + ["checkbox"]*2 + ["slider"]*2 + ["checkbox"]*17 + ["slider"]*2 + ["checkbox"]*24
    DynamicDimension = apps.get_model('projects', 'DynamicDimension')
    for i in range(len(dimensions)):
        object = DynamicDimension(name=dimensions[i], type=dimension_types[i])
        object.save()


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0008_affectiveannotationproject_is_combination_mode'),
    ]
    operations = [
        migrations.CreateModel(
            name='DynamicDimension',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(choices=[('slider', 'Slider'), ('checkbox', 'Checkbox')], max_length=10)),
            ],
        ),
        migrations.RunPython(populate_dimensions)
    ]
