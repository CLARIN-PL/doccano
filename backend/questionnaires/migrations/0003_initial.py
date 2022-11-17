# Generated by Django 4.0.4 on 2022-09-29 14:25

from django.db import migrations, models
import django.db.models.deletion


def populate_questions(apps, schema_editor):
    ipip_bfm_questions = [
        "Jestem duszą towarzystwa.",
        "Niezbyt obchodzą mnie inni ludzie.",
        "Zostawiam moje rzeczy gdzie popadnie.",
        "Zwykle jestem zrelaksowany/a.",
        "Mam bogate słownictwo.",
        "Trzymam się z boku.",
        "Jestem wyrozumiały/a dla uczuć innych ludzi.",
        "Bez zwłoki wypełniam codzienne obowiązki.",
        "Często martwię się czymś.",
        "Mam trudności ze zrozumieniem abstrakcyjnych pojęć.",
        "Rozmawiam z wieloma różnymi ludźmi na przyjęciach.",
        "Nie interesują mnie problemy innych ludzi.",
        "Często zapominam odkładać rzeczy na miejsce.",
        "Rzadko czuję się przygnębiony/a.",
        "Mam głowę pełną pomysłów.",
        "Wśród nieznajomych jestem małomówny/a.",
        "Znajduję czas dla innych.",
        "Postępuję zgodnie z harmonogramem.",
        "Często miewam huśtawki nastrojów.",
        "Nie mam zbyt bogatej wyobraźni.",
    ]
    demografia_questions = [
        "[Płeć / Gender]",
        "[Wiek]",
        "[Narodowość]",
        "[Język]",
        "[Dzieci]",
        "[Opieka]",
        "[Dochody]",
        "[Sektor zatrudnienia]",
        "[Status związku]",
        "[Wielkość gospodarstwa domowego]",
        "[Wykształcenie]",
        "[Obecnie studiujesz]",
        "[Zatrudnienie]",
        "[Religia]",
        "[Poglądy polityczne]",
        "Oś ekonomiczna",
        "Oś światopoglądowa/społeczna:"
    ]
    humor_styles_questions = [
        "Zazwyczaj nie śmieję się i nie żartuję zbytnio z innymi ludźmi.",
        "Jeśli czuję się przygnębiony, zwykle mogę się rozweselić humorem.",
        "Jeśli ktoś popełni błąd, często będę tym dokuczać.",
        "Pozwalam ludziom śmiać się ze mnie lub żartować moim kosztem bardziej niż powinienem.",
        "Nie muszę ciężko pracować nad rozśmieszaniem innych ludzi — wydaje mi się, że jestem osobą z natury dowcipną.",
        "Nawet gdy jestem sam, często bawią mnie absurdy życia.",
        "Ludzie nigdy nie są urażeni ani zranieni moim poczuciem humoru.",
        "Często daję się ponieść umniejszaniu sobie, jeśli rozśmiesza to moją rodzinę lub przyjaciół.",
        "Rzadko rozśmieszam innych ludzi opowiadając zabawne historie o sobie.",
        "Jeśli czuję się zdenerwowany lub nieszczęśliwy, zwykle staram się wymyślić coś zabawnego w tej sytuacji, aby poczuć się lepiej.",
        "Kiedy opowiadam dowcipy lub mówię śmieszne rzeczy, zwykle nie przejmuję się tym, jak inni ludzie to odbierają.",
        "Często staram się, aby ludzie bardziej mnie polubili lub zaakceptowali, mówiąc coś śmiesznego o moich własnych słabościach, błędach lub wadach.",
        "Z najbliższymi przyjaciółmi dużo się śmieję i żartuję.",
        "Moje humorystyczne spojrzenie na życie powstrzymuje mnie przed nadmiernym denerwowaniem się lub przygnębieniem z powodu różnych rzeczy.",
        "Nie lubię, gdy ludzie używają humoru jako sposobu na krytykowanie lub poniżanie kogoś.",
        "Rzadko używam humoru, by sobie umniejszać.",
        "Zazwyczaj nie lubię opowiadać dowcipów ani bawić ludzi.",
        "Jeśli jestem sam i czuję się nieszczęśliwy, staram się wymyślić coś zabawnego, aby podnieść się na duchu.",
        "Czasami myślę o czymś, co jest tak zabawne, że nie mogę się powstrzymać przed powiedzeniem tego, nawet jeśli nie jest to odpowiednie do sytuacji.",
        "Często przekraczam granicę w umniejszaniu sobie, kiedy robię sobie żarty lub próbuję być zabawny.",
        "Lubię bawić ludzi.",
        "Jeśli czuję się smutny lub zdenerwowany, zwykle tracę poczucie humoru.",
        "Nigdy nie śmieję się z innych, nawet jeśli robią to wszyscy moi znajomi.",
        "Kiedy jestem z przyjaciółmi lub rodziną, często wydaję się być tym, z którego inni ludzie się śmieją lub z którego żartują.",
        "Nieczęsto żartuję z przyjaciółmi.",
        "Z mojego doświadczenia wynika, że myślenie o jakimś zabawnym aspekcie sytuacji jest często bardzo skutecznym sposobem radzenia sobie z problemami.",
        "Jeśli kogoś nie lubię, często używam humoru lub przekomarzania się, aby mu umniejszyć.",
        "Jeśli mam problemy lub czuję się nieszczęśliwy, często ukrywam to przez żarty, aby nawet moi najbliżsi przyjaciele nie wiedzieli, jak naprawdę się czuję.",
        "Zwykle nie potrafię wymyślić dowcipnych rzeczy do powiedzenia, gdy jestem z innymi ludźmi.",
        "Nie muszę przebywać z innymi ludźmi, żeby czuć się rozbawiony - zwykle potrafię znaleźć rzeczy do śmiechu nawet wtedy, gdy jestem sam.",
        "Nawet jeśli coś jest dla mnie naprawdę zabawne, nie będę się z tego śmiał ani żartował, jeśli ktoś będzie urażony.",
        "Pozwalając innym na śmianie się ze mnie jest moim sposobem na utrzymanie moich przyjaciół i rodziny w dobrym nastroju.",
    ]
    swlsa_questions = [
        "Pod wieloma względami moje życie jest zbliżone do ideału.",
        "Warunki mojego życia są doskonałe.",
        "Jestem zadowolony/a z mojego życia.",
        "W życiu osiągnąłem/osiągnęłam najważniejsze rzeczy, które chciałem/am.",
        "Gdybym mógł/mogła jeszcze raz przeżyć swoje życie, to nie chciałbym/chciałabym prawie nic zmienić.",
    ]
    spane_questions = [
        "Pozytywnie",
        "Negatywnie",
        "Dobrze",
        "Źle",
        "Przyjemnie",
        "Nieprzyjemnie",
        "Szczęśliwy/-a",
        "Smutny/-a",
        "Przestraszony/-a",
        "Radosny/-a",
        "Rozgniewany/-a",
        "Zadowolony/-a",
    ]
    skala_questions = [
        "Prowadzę życie, które ma sens i cel.",
        "Moje relacje społeczne są wspierające i dają mi satysfakcję.",
        "Angażuję się i interesuję tym, czym zajmuję się na co dzień.",
        "Aktywnie przyczyniam się do szczęścia i dobrostanu innych.",
        "Jestem kompetentny i zdolny do wykonywania zajęć, które są dla mnie ważne.",
        "Jestem dobrym człowiekiem i prowadzę dobre życie.",
        "Z optymizmem patrzę na swoją przyszłość.",
        "Ludzie mnie szanują.",
    ]
    phq9_questions = [
        "Niewielkie zainteresowanie lub odczuwanie przyjemności z wykonywania czynności.",
        "Uczucie smutku, przygnębienia lub beznadziejności.",
        "Kłopoty z zaśnięciem lub przerywany sen, albo zbyt długi sen.",
        "Uczucie zmęczenia lub brak energii.",
        "Brak apetytu lub przejadanie się.",
        "Poczucie niezadowolenia z siebie — lub uczucie, że jest się do niczego, albo że zawiódł/zawiodła Pan/Pani siebie lub rodzinę.",
        "Problemy ze skupieniem się na przykład przy czytaniu gazety lub oglądaniu telewizji.",
        "Poruszanie się lub mówienie tak wolno, że inni mogliby to zauważyć? Albo wręcz przeciwnie — niemożność usiedzenia w miejscu lub podenerwowanie powodujące ruchliwość znacznie większą niż zwykle.",
        "Myśli, że lepiej byłoby umrzeć, albo chęć zrobienia sobie jakiejś krzywdy.",
    ]
    pss_questions = [
        "Jak często w ciągu ostatniego miesiąca byłeś/aś zdenerwowany/a, ponieważ zdarzyło się coś niespodziewanego?",
        "Jak często w ciągu ostatniego miesiąca czułeś/aś, że ważne sprawy w twoim życiu wymykają ci się spod kontroli?",
        "Jak często w ciągu ostatniego miesiąca odczuwałeś/aś zdenerwowanie i napięcie?",
        "Jak często w ciągu ostatniego miesiąca byłeś/aś przekonany/a, że jesteś w stanie poradzić sobie z problemami osobistymi?",
        "Jak często w ciągu ostatniego miesiąca czułeś/aś, że sprawy układają się po twojej myśli?",
        "Jak często w ciągu ostatniego miesiąca stwierdzałeś/aś, że nie radzisz sobie ze wszystkimi obowiązkami?",
        "Jak często w ciągu ostatniego miesiąca potrafiłeś/aś opanować swoje rozdrażnienie?",
        "Jak często w ciągu ostatniego miesiąca czułeś/aś, że wszystko ci wychodzi?",
        "Jak często w ciągu ostatniego miesiąca złościłeś/aś się, ponieważ nie miałeś/aś wpływu na to co się zdarzyło?",
        "Jak często w ciągu ostatniego miesiąca czułeś/aś, że nie możesz przezwyciężyć narastających trudności?",
    ]
    zdrowie_questions = [
        "Jak często miałeś/aś trudności z zasypianiem w nocy?",
        "Jak często budziłeś/aś się w nocy?",
        "Jak często miałeś/aś koszmary senne lub niepokojące sny?",
        "Jak często Twój sen był spokojny i niezakłócony?",
        "Jak często miałeś/aś bóle głowy?",
        "Jak często bolała Cię głowa, gdy wywierano się na Ciebie dużą presję, aby załatwić sprawy?",
        "Jak często bolała Cię głowa, gdy byłeś/aś sfrustrowany/a, ponieważ sprawy nie ułożyły się tak, jak powinny, lub gdy byłeś/aś na kogoś zirytowany/a?",
        "Jak często cierpiałeś/aś z powodu rozstroju żołądka (niestrawności)?",
        "Jak często musiałeś/aś uważać na to, co jesz, aby uniknąć rozstroju żołądka?",
        "Jak często miałeś/aś mdłości lub inne problemy żołądkowe?",
        "Jak często miałeś/aś zaparcia lub cierpiałeś na biegunkę?",
        "Ile razy miałeś/aś drobne przeziębienie (np. takie które sprawiło, że czułeś/aś się niekomfortowo, ale nie zatrzymało Cię ono w łóżku ani nie spowodowało, że opuściłeś/aś pracę)?",
        "Ile razy miałeś/aś infekcje dróg oddechowych, poważniejsze niż drobne przeziębienie (np. takie które 'rozłożyły' cię na łopatki - zapalenie oskrzeli, zapalenie zatok itp.)?",
        "Jak długo na ogół trwało przeziębienie lub grypa, które przechodziłeś/aś?",
    ]
    ress_ema_questions = [
        "Starałem/am się zwolnić tętno i oddech.",
        "Wziąłem/am głęboki oddech.",
        "Okazałem/am swoje uczucia.",
        "Wyraziłem/am swoje uczucia.",
        "W kółko myślałem/am o tym wydarzeniu emocjonalnym.",
        "Ciągle myślałem/am o tym, co mi przeszkadzało.",
        "Myślałem/am o innych sposobach interpretacji sytuacji.",
        "Spojrzałem/am na sytuację z kilku różnych punktów widzenia.",
        "Zaangażowałem/am się w coś innego, żeby mieć zajęcie.",
        "Zaangażowałem/am się w jakieś czynności, żeby odwrócić swoją uwagę.",
        "Starałem/am się ukryć swoje uczucia.",
        "Udawałem/am, że wcale nie odczuwam emocji, którą odczuwałem/am.",
    ]
    paq_questions = [
        "Kiedy czuję się źle (odczuwam nieprzyjemne emocje), nie potrafię znaleźć odpowiednich słów, by opisać te uczucia.",
        "Kiedy czuję się źle, nie potrafię powiedzieć, czy jestem smutny, zły czy przestraszony.",
        "Mam skłonność do ignorowania tego, co czuję.",
        "Kiedy czuję się dobrze (odczuwam przyjemne emocje), nie potrafię znaleźć odpowiednich słów, by opisać te uczucia.",
        "Kiedy czuję się dobrze, nie potrafię powiedzieć, czy jestem szczęśliwy, podekscytowany czy rozbawiony.",
        "Nie zwracam uwagi na swoje emocje.",
    ]
    zwrotna_questions = [
        "Jak często powinno się robić przerwy w pracy anotacyjnej?",
        "Jak długie powinno się robić przerwy w pracy anotacyjnej?",
        "Co byś zmieniła/zmienił w ankiecie?"
    ]
    sen_questions = [
        "Jak oceniasz jakość swojego snu ostatniej nocy?",
        "Jak czułeś/aś się dziś rano?",
    ]
    stres_rano_questions = [
        "Czuję się zestresowany, niespokojny, przytłoczony.",
        "Czuję, że panuję nad sytuacją, dobrze sobie radzę, mam wszystko pod kontrolą.",
    ]
    stres_wieczor_questions = [
        "Czuję, że wszystko mnie teraz przytłacza.",
        "Czuję, że wszystko jest teraz nieprzewidywalne.",
    ]
    zdrowie_wieczor_questions = [
        "Jak oceniasz stan swojego zdrowia?",
    ]
    emocje_questions = [
        "Czy właśnie czułeś silną emocję?",
        "Jak się czułaś:",
    ]
    anotacja_koniec_questions = [
        "Jak często powinno się robić przerwy w pracy anotacyjnej?",
        "Jak długie powinno się robić przerwy w pracy anotacyjnej?",
        "Czy któreś pytanie/polecenie dotyczące tekstu było niezrozumiałe?",
        "Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Dlaczego?",
        "Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Dlaczego?",
        "Czy tekst wzbudza w Tobie jakiekolwiek emocje? Dlaczego?",
        "etc? Dlaczego?",
        "Tekstów było?"
        "Jaka liczba tekstów byłaby odpowiednia?",
        "Co byś zmieniła/zmienił w badaniu?",
    ]
    ankieta_tygodniu_questions = [
        "Czy spotkanie na Google Meets było problematyczne?",
        "Czy wolałabyś/wolałbyś spotkanie na Zoom?",
        "Czy wolałabyś/wolałbyś spotkanie na innej platformie (jakiej)?",
        "Czy korzystałeś/korzystałaś z kontaktu z osobą odpowiedzialną za rozwiązywanie problemów i wsparcie?",
        "Czy masz jakieś pomysły/sugestie dotyczące webinarium?",
        "Jak często powinno się robić przerwy w pracy anotacyjnej?",
        "Jak długie powinno się robić przerwy w pracy anotacyjnej?",
        "Czy któreś pytanie/polecenie dotyczące tekstu było niezrozumiałe?",
        "Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Dlaczego?",
        "Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Dlaczego?",
        "Czy tekst wzbudza w Tobie jakiekolwiek emocje? Dlaczego?",
        "etc? Dlaczego?",
        "Tekstów było?"
        "Jaka liczba tekstów byłaby odpowiednia?",
        "Co byś zmieniła/zmienił w badaniu?",
    ]
    questions = ipip_bfm_questions + demografia_questions +  humor_styles_questions + spane_questions + skala_questions + phq9_questions + pss_questions + zdrowie_questions + ress_ema_questions + paq_questions + zwrotna_questions + sen_questions + stres_rano_questions + stres_wieczor_questions + zdrowie_wieczor_questions + emocje_questions + anotacja_koniec_questions + ankieta_tygodniu_questions
    questionnaire = [1]*len(ipip_bfm_questions) + [2]*len(demografia_questions) + [3]*len(humor_styles_questions) + [4]*len(swlsa_questions) + [5]*len(spane_questions) + [6]*len(skala_questions) + [7]*len(phq9_questions) + [8]*len(pss_questions) + [9]*len(zdrowie_questions) + [10]*len(ress_ema_questions) + [11]*len(paq_questions) + [12]*len(zwrotna_questions) + [13]*len(sen_questions) + [14]*len(stres_rano_questions) + [15]*len(stres_wieczor_questions) + [16]*len(zdrowie_wieczor_questions) + [17]*len(emocje_questions) + [18]*len(anotacja_koniec_questions) + [19]*len(ankieta_tygodniu_questions)

    Question = apps.get_model('questionnaires', 'Question')
    Questionnaire = apps.get_model('questionnaires', 'Questionnaire')
    for i in range(len(questions)):
        object = Question(question_text=questions[i], questionnaire=Questionnaire(questionnaire[i]))
        object.save()


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('questionnaires', '0002_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.CharField(max_length=1024)),
                ('questionnaire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='questionnaires.questionnaire')),
            ],
        ),
        migrations.RunPython(populate_questions),
    ]
