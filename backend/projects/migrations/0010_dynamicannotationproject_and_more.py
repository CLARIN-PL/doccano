# Generated by Django 4.0.4 on 2023-02-20 15:37

from django.db import migrations, models
import django.db.models.deletion


def populate_dimension_metadata(apps, schema_editor):
    emo_dim_codename = []
    for i in range(12):
        emo_dim_codename.append("DIM_EMO{}".format(i))
    
    other_dim_codename = []
    for i in range(12):
        other_dim_codename.append("DIM_OTH{}".format(i))

    offensive_dim_codename = []
    for i in range(19):
        offensive_dim_codename.append("DIM_OFF{}".format(i))

    humor_dim_codename = []
    for i in range(26):
        humor_dim_codename.append("DIM_HUM{}".format(i))

    codenames = emo_dim_codename + other_dim_codename + offensive_dim_codename + humor_dim_codename

    meta_config_positive = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Nie wzbudza pozytywnych emocji",
        "maxVal_description": "Wzbudza bardzo pozytywne emocje"
    }
    meta_config_negative = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Nie wzbudza negatywnych emocji",
        "maxVal_description": "Wzbudza bardzo negatywne emocje"
    }
    meta_config_radosc = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Nie wzbudza radości",
        "maxVal_description": "Wzbudza radość w bardzo dużym stopniu"
    }
    meta_config_zachwyt = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Nie wzbudza zachwytu",
        "maxVal_description": "Wzbudza zachwyt w bardzo dużym stopniu"
    }
    meta_config_inspiruje = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale nie inspiruje",
        "maxVal_description": "Bardzo inspiruje"
    }
    meta_config_spokoi = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale nie przynosi spokoju",
        "maxVal_description": "Przynosi spokój w bardzo dużym stopniu"
    }
    meta_config_zaskoczenie = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale nie zaskakuje",
        "maxVal_description": "Zaskakuje w bardzo dużym stopniu"
    }
    meta_config_wspol = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale nie wzbudza współczucia",
        "maxVal_description": "Wzbudza współczucie w bardzo dużym stopniu"
    }   
    meta_config_strach = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale nie wzbudza strachu",
        "maxVal_description": "Wzbudza strach w bardzo dużym stopniu"
    } 
    meta_config_smutek = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale nie wzbudza smutku",
        "maxVal_description": "Wzbudza smutek w bardzo dużym stopniu"
    }
    meta_config_wstret = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale nie wzbudza wstrętu",
        "maxVal_description": "Wzbudza wstręt w bardzo dużym stopniu"
    }
    meta_config_zlosc = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale nie wzbudza złości",
        "maxVal_description": "Wzbudza złość w bardzo dużym stopniu"
    }

# 10 dimensions
    meta_config_ironiczny = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 1,
        "checkbox_codename": "DIM_OTH10",
        "minVal_description": "Całkowicie nieironiczny",
        "maxVal_description": "Bardzo ironiczny"
    }
    meta_config_zenujacy = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 1,
        "checkbox_codename": "DIM_OTH10",
        "minVal_description": "Całkowicie nieżenujący",
        "maxVal_description": "Bardzo żenujący"
    }
    meta_config_wulgarny = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 1,
        "checkbox_codename": "DIM_OTH10",
        "minVal_description": "Całkowicie niewulgarny",
        "maxVal_description": "Bardzo wulgarny"
    }
    meta_config_polityczny = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 1,
        "checkbox_codename": "DIM_OTH10",
        "minVal_description": "Całkowicie niepolityczny",
        "maxVal_description": "Bardzo polityczny"
    }
    meta_config_interesujacy = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 1,
        "checkbox_codename": "DIM_OTH10",
        "minVal_description": "Całkowicie nieinteresujący",
        "maxVal_description": "Bardzo interesujący"
    }
    meta_config_zrozumialy = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 1,
        "checkbox_codename": "DIM_OTH10",
        "minVal_description": "Całkowicie niezrozumiały",
        "maxVal_description": "Bardzo zrozumiały"
    }
    meta_config_zgadzam_to_czuje = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 1,
        "checkbox_codename": "DIM_OTH10",
        "minVal_description": "W ogóle nie zgadzam się z tym stwierdzeniem",
        "maxVal_description": "Całkowicie zgadzam się z tym stwierdzeniem"
    }
    meta_config_humor_offensive = {
        "slider_min": 0,
        "slider_max": 10,
        "slider_step": 1,
        "with_checkbox": 0,
        "minVal_description": "Wcale",
        "maxVal_description": "W pełni"
    }

    meta_checkbox_sc_values = {
        "is_multiple_answers": 0,
        "min_answer_number": 0,
        "max_answer_number": 1,
        "options": ''
    }

    meta_checkbox_mc_values_1 = {
        "is_multiple_answers": 1,
        "min_answer_number": 0,
        "max_answer_number": 9,
        "original_question": "Ze względu na co obraża",
        "options": 'Płeć; Narodowość; Przekonania religijne; Rasę, kolor skóry, wygląd; Wiek; Czyn, działanie; Orientację seksualną; Poglądy polityczne, partie; Inne, np. grupy społeczne, zawodowe'
    }

    meta_checkbox_mc_values_2 = {
        "is_multiple_answers": 1,
        "min_answer_number": 0,
        "max_answer_number": 8,
        "original_question": "W jaki sposób?",
        "options": "Mowa nienawiści; Odczłowieczenie; Nawoływanie do przemocy; Nawoływanie do ludobójstwa; Niesprawiedliwe uogólnianie, stereotypy; Lekceważenie; Upokorzenie; Inne"
    }

    meta_checkbox_mc_values_3 = {
        "is_multiple_answers": 1,
        "min_answer_number": 0,
        "max_answer_number": 9,
        "original_question": "Autor śmieje się z",
        "options": 'Płeć; Narodowość; Przekonania religijne; Rasę, kolor skóry, wygląd; Wiek; Czyn, działanie; Orientację seksualną; Poglądy polityczne, partie; Inne, np. grupy społeczne, zawodowe'
    }

    meta_checkbox_mc_values_4 = {
        "is_multiple_answers": 1,
        "min_answer_number": 0,
        "max_answer_number": 15,
        "original_question": "Charakter humoru, śmieszy ze względu na",
        "options": "Czarny humor; Ironię; Sarkazm; Dwuznaczność; Grę słów; Seksualność; Humor fekalny (o kupie :-) ); Brzmienie słów; Wyolbrzymienie; Niecenzuralne słowa; Kontrast; Ma charakter dowcipu, kawału, żartu; Absurd; Humor sytuacyjny; Humor patetyczny"
    }
    emo_meta_configs = [meta_config_positive, meta_config_negative, meta_config_radosc, meta_config_zachwyt, meta_config_inspiruje, meta_config_spokoi, meta_config_zaskoczenie, meta_config_wspol, meta_config_strach, meta_config_smutek, meta_config_wstret, meta_config_zlosc]
    other_meta_configs = [meta_config_ironiczny, meta_config_zenujacy, meta_config_wulgarny, meta_config_polityczny, meta_config_interesujacy, meta_config_zrozumialy]
    meta_values =  emo_meta_configs + other_meta_configs + [meta_config_zgadzam_to_czuje]*4 + [meta_checkbox_sc_values]*2 + [meta_config_humor_offensive]*2 + [meta_checkbox_mc_values_1]*9 + [meta_checkbox_mc_values_2]*8 + [meta_config_humor_offensive]*2 + [meta_checkbox_mc_values_3]*9 + [meta_checkbox_mc_values_4]*15    
    dimensions = list(range(1, 70))
    meta_required_field = [1]*12 + [0]*12 + [1]*2 + [0]*17 + [1]*2 + [0]*24
    meta_readonly_field = [0]*69

    DimensionMetadata = apps.get_model('projects', 'DimensionMetaData')
    Dimensions = apps.get_model('projects', 'DynamicDimension')
    for i in range(len(codenames)):
        object = DimensionMetadata(codename=codenames[i], value=meta_values[i], required=meta_required_field[i], readonly=meta_readonly_field[i], dimension=Dimensions(dimensions[i]))
        object.save()


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0009_dynamicannotationproject_init_database'),
    ]
    operations = [
        migrations.CreateModel(
            name='DimensionMetaData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dimension', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.DynamicDimension')),
                ('codename', models.CharField(max_length=10)),
                ('value', models.JSONField(default=dict)),
                ('required', models.BooleanField(default=False)),
                ('readonly', models.BooleanField(default=False)),
            ],
        ),
        migrations.RunPython(populate_dimension_metadata),
    ]
