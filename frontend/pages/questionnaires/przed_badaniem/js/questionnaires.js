export const qTypes = [
    {
        id: "1.1",
        name: "Przed badaniem",
        questionnaires: [
            {
                name: "Kwestionariusz IPIP-BFM-20",
                language: "pl",
                id: 1,
                typeId: "1.1",
                type: "osobowość",
                description: "Przeczytaj uważnie poniższe zdania, opisujące różne zachowania, uczucia i myśli ludzi. Zastanów się nad każdym z nich – w jakim stopniu opisuje ono również Ciebie takiego/taką, jakim/jaką zwykle jesteś? Ludzie są bardzo różni, więc nie ma tu dobrych ani złych odpowiedzi. Za każdym razem po prostu szczerze odpowiedz na pytanie, w jakim stopniu dane stwierdzenie opisuje Ciebie.",
                segments: [
                    {
                        scales: {
                            description:"Posługuj się następującą skalą:",
                            values: [
                                {
                                    value: 1,
                                    text: "całkowicie nietrafnie mnie opisuje"
                                },
                                {
                                    value: 2,
                                    text: "raczej nietrafnie mnie opisuje"
                                },
                                {
                                    value: 3,
                                    text: "trochę trafnie, a trochę nietrafnie mnie opisuje"
                                },
                                {
                                    value: 4,
                                    text: "raczej trafnie mnie opisuje"
                                },
                                {
                                    value: 5,
                                    text: "całkowicie trafnie mnie opisuje"
                                }
                            ]
                        },
                        questions: [
                            {
                                text: "Jestem duszą towarzystwa.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Niezbyt obchodzą mnie inni ludzie.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Zostawiam moje rzeczy gdzie popadnie.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Zwykle jestem zrelaksowany/a.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Mam bogate słownictwo.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Trzymam się z boku.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Jestem wyrozumiały/a dla uczuć innych ludzi.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Bez zwłoki wypełniam codzienne obowiązki.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Często martwię się czymś.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Mam trudności ze zrozumieniem abstrakcyjnych pojęć.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Rozmawiam z wieloma różnymi ludźmi na przyjęciach.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Nie interesują mnie problemy innych ludzi.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Często zapominam odkładać rzeczy na miejsce.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Rzadko czuję się przygnębiony/a.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Mam głowę pełną pomysłów.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Wśród nieznajomych jestem małomówny/a.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Znajduję czas dla innych.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Postępuję zgodnie z harmonogramem.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Często miewam huśtawki nastrojów.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Nie mam zbyt bogatej wyobraźni.",
                                type: "slider",
                                min: 1,
                                max: 5,
                                value: -1,
                            }
                        ]
                    }
                ]
            },
            {
                name: "Demografia",
                type: "demografia",
                id: 2,
                typeId: "1.1",
                language: "pl",
                segments: [
                    {
                        questions: [
                            {
                                type: "radio",
                                header: "[Płeć / Gender]",
                                text: "Określam swoją płeć jako...",
                                options: [
                                    {
                                        text: "Kobieta",
                                    },
                                    {
                                        text: "Mężczyzna",
                                    },
                                    {
                                        text: "Niebinarna",
                                    },
                                    {
                                        text: "Wolę się samookreślić (odpowiedź otwarta)", 
                                        showTextbox: true,
                                    },
                                    {
                                        text: "Wolę nie mówić",
                                    }
                                ]
                            },
                            {
                                type: "text",
                                header: "[Wiek]",
                                text: "Jaki jest Twój wiek w latach (proszę wpisać tylko liczbę)?",
                                numericOnly: true,
                            },
                            {
                                type: "text",
                                header: "[Narodowość]",
                                text: "Jakiej jesteś narodowości? (np. polska)",
                            },
                            {
                                type: "radio",
                                header: "[Język]",
                                text: "Czy język polski jest Twoim pierwszym lub ojczystym językiem?",
                                options: [
                                    {
                                        text: "Tak",
                                    },
                                    {
                                        text: "Nie",
                                    }
                                ] 
                            },
                            {
                                type: "radio",
                                header: "[Dzieci]",
                                text: "Czy masz dzieci w wieku poniżej 18 lat?",
                                options: [
                                    {
                                        text: "Tak: proszę wymienić liczbę dzieci w polu odpowiedzi otwartej (tu odpowiedź otwarta)",
                                        numericOnly: true,
                                        showTextbox: true,
                                    },
                                    {
                                        text: "Nie",
                                    }
                                ] 
                            },
                            {
                                type: "radio",
                                header: "[Opieka]",
                                text: "Czy masz inne obowiązki związane z opieką nad dziećmi?",
                                options: [
                                    {
                                        text: "Tak",
                                    },
                                    {
                                        text: "Nie",
                                    }
                                ] 
                            },
                            {
                                type: "radio",
                                header: "[Dochody]",
                                text: "Twoja sytuacja ekonomiczna w porównaniu do przeciętnej osoby w Twoim kraju jest:",
                                options: [
                                    {
                                        text: "zdecydowanie gorsza",
                                    },
                                    {
                                        text: "gorsza",
                                    },
                                    {
                                        text: "raczej gorsza",
                                    },
                                    {
                                        text: "podobna / taka sama",
                                    },
                                    {
                                        text: "raczej lepsza",
                                    },
                                    {
                                        text: "lepsza",
                                    },
                                    {
                                        text: "zdecydowanie lepsza",
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                header: "[Sektor zatrudnienia]",
                                text: "Sektor zatrudnienia",
                                options: [
                                    {
                                        text: "Przetwórstwo przemysłowe",
                                    },
                                    {
                                        text: "Rolnictwo, leśnictwo, łowiectwo, rybactwo",
                                    },
                                    {
                                        text: "Handel; naprawa pojazdów samochodowych",
                                    },
                                    {
                                        text: "Edukacja",
                                    },
                                    {
                                        text: "Administracja publiczna i obrona narodowa; obowiązkowe zabezpieczenia społeczne",
                                    },
                                    {
                                        text: "Budownictwo",
                                    },
                                    {
                                        text: "Transport i gospodarka magazynowa",
                                    },
                                    {
                                        text: "Opieka zdrowotna i pomoc społeczna",
                                    },
                                    {
                                        text: "Działalność profesjonalna, naukowa i techniczna",
                                    },
                                    {
                                        text: "Administrowanie i działalność wspierająca",
                                    },
                                    {
                                        text: "Informacja i komunikacja",
                                    },
                                    {
                                        text: "Działalność finansowa i ubezpieczeniowa",
                                    },
                                    {
                                        text: "Pozostała Działalność usługowa",
                                    },
                                    {
                                        text: "Zakwaterowanie i gastronomia",
                                    },
                                    {
                                        text: "Obsługa rynku nieruchomości",
                                    },
                                    {
                                        text: "Dostawa wody, gospodarowanie Ściekami i odpadami",
                                    },
                                    {
                                        text: "Działalność związana z kulturą, rozrywką i rekreacją",
                                    },
                                    {
                                        text: "Gómictwo i wydobywanie",
                                    },
                                    {
                                        text: "Inny: ",
                                        showTextbox: true,
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                header: "[Status związku]",
                                text: "Jaki jest Twój status związku?",
                                options: [
                                    {
                                        text: "Samotny/a",
                                    },
                                    {
                                        text: "W związku, ale nie mieszkamy razem",
                                    },
                                    {
                                        text: "Zamężna lub mieszkająca razem",
                                    },
                                    {
                                        text: "Owdowiały/a",
                                    },
                                    {
                                        text: "Rozwiedziony/a lub w separacji",
                                    },
                                    {
                                        text: "Inne (proszę określić) (odpowiedź otwarta)",
                                        showTextbox: true
                                    }
                                ]
                            },
                            {
                                type: "text",
                                header: "[Wielkość gospodarstwa domowego]",
                                text: "Ile osób, łącznie z Tobą, mieszka w gospodarstwie domowym?",
                                numericOnly: true,
                            },
                            {
                                type: "radio",
                                header: "[Wykształcenie]",
                                text: "Jaki jest Twój poziom wykształcenia?",
                                options: [
                                    {
                                        text: "Podstawowe"
                                    },
                                    {
                                        text: "Średnie"   
                                    },
                                    {
                                        text: "Wyższe (w trakcie)"
                                    },
                                    {
                                        text: "Wyższe"
                                    }
                                ]   
                            },
                            {
                                type: "radio",
                                header: "[Obecnie studiujesz]",
                                text: "Czy obecnie studiujesz?",
                                options: [
                                    {
                                        text: "Tak"
                                    },
                                    {
                                        text: "Nie"
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                header: "[Zatrudnienie]",
                                text: "Jaki jest Twój status zatrudnienia?",
                                options: [
                                    {
                                        text: "Pełny etat"   
                                    },
                                    {
                                        text: "W niepełnym wymiarze czasu pracy"
                                    },
                                    {
                                        text: "Dorywczo"
                                    },
                                    {
                                        text: "Samozatrudniony"
                                    },
                                    {
                                        text: "Bezrobotny (i poszukujący pracy)"   
                                    },
                                    {
                                        text: "Bezrobotni (nie poszukujący pracy)"
                                    },
                                    {
                                        text: "Nie pracuję zarobkowo (np. opieka, pomoc domowa, emerytura, wolontariat, student, uczeń)"
                                    },
                                    {
                                        text: "Zamierzam wkrótce rozpocząć nową pracę"
                                    },
                                    {
                                        text: "Inny (proszę określić) (odpowiedź otwarta)",
                                        showTextbox: true
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                header: "[Religia]",
                                text: "Czy jesteś osobą religijną?",
                                options: [
                                    {
                                        text: "Nie"
                                    },
                                    {
                                        text: "Raczej nie"
                                    },
                                    {
                                        text: "Raczej tak"
                                    },
                                    {
                                        text: "Tak"
                                    }
                                ]
                            },
                            {
                                type: "text",
                                header: "[Poglądy polityczne]",
                                text: "Z jakimi poglądami politycznymi się utożsamiasz na osi ekonomicznej oraz światopoglądowej? (odpowiedź nieobowiązkowa)",
                                required: false
                            },
                            {
                                type: "radio",
                                text: "Oś ekonomiczna",
                                options: [
                                    {
                                        text: "Lewicowe (rozwinięty interwencjonizm państwowy, wysokie podatki, wyższe podatki dla bogatszych, rozwinięta polityka socjalna)",
                                        showSlider: true,
                                        min: 1,
                                        max: 10,
                                        showTickLabels: true
                                    },
                                    {
                                        text: "Prawicowe (dominacja własności prywatnej, ograniczenie interwencjonizmu państwowego, niskie podatki, ograniczone ramy polityki socjalnej państwa)",
                                        showSlider: true,
                                        min: 1,
                                        max: 10,
                                        showTickLabels: true
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                text: "Oś światopoglądowa/społeczna:",
                                options: [
                                    {
                                        text: "Liberalne (akceptacja związków homoseksualnych, transseksualizmu, aborcji, egalitarność)",
                                        showSlider: true,
                                        min: 1,
                                        max: 10,
                                        showTickLabels: true
                                    },
                                    {
                                        text: "Konserwatywne (ważne wartości to rodzina, naród, tradycja, hierarchia społeczna)",
                                        showSlider: true,
                                        min: 1,
                                        max: 10,
                                        showTickLabels: true

                                    }
                                ]
                            }
                        ]
                    }
                ],
                footer: ""
            },
            {
                type: "humor",
                name: "Humor Styles Questionnaire",
                id: 3,
                typeId: "1.1",
                language: "pl",
                segments: [
                    {
                        scales: {
                            description: "Pytania od Q1 do Q32 należy oceniać w skali całkowitoliczbowej od 1 do 5.",
                            values: [
                                {
                                    value: 1,
                                    text: "Nigdy lub bardzo rzadko",
                                },
                                {
                                    value: 2,
                                    text: "Rzadko"
                                },
                                {
                                    value: 3,
                                    text: "Czasem tak"
                                },
                                {
                                    value: 4,
                                    text: "Zwykle tak"
                                },
                                {
                                    value: 5,
                                    text: "Często lub zawsze"
                                }
                            ]
                        },
                        prependIndex: "Q",
                        questions: [
                            {
                                type: "slider",
                                text: "Rzadko śmieję się lub żartuję z innymi ludźmi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Gdy czuję się przygnębiony(a), zazwyczaj potrafię sam(a) się rozweselić.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jeżeli ktoś popełni błąd, wypowiadam uszczypliwą uwagę.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Bardziej niż powinienem/powinnam, pozwalam ludziom śmiać się ze mnie lub bawić się moim kosztem.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nie sprawia mi dużej trudności rozśmieszenie innych. Wydaje mi się, że jestem osobą obdarzoną naturalnym poczuciem humoru.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nawet kiedy jestem sam(a), często rozśmieszają mnie absurdalne sytuacje życiowe.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Ludzie nigdy nie czują się urażeni ani dotknięci moim poczuciem humoru.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Często przesadzam w ośmieszaniu siebie, jeżeli bawi to moją rodzinę lub przyjaciół.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Rzadko rozśmieszam innych, opowiadając zabawne historyjki o sobie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jeżeli jestem zmartwiony(a) lub czuję się nieszczęśliwy(a), zazwyczaj staram się znaleźć coś zabawnego w tej sytuacji, aby poprawić sobie humor.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Opowiadając dowcipy lub zabawne historie, zazwyczaj nie zastanawiam się nad tym czy ktoś poczuje się dotknięty/urażony.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Często staram się sprawić, aby ludzie bardziej polubili lub zaakceptowali mnie poprzez opowiadanie zabawnych rzeczy o własnych słabościach, gafach lub błędach.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Dużo śmieję się i często żartuję w gronie moich najbliższych przyjaciół.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Moje pełne humoru spojrzenie na życie sprawia, że mniej martwię się różnymi sprawami.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nie podoba mi się kiedy ktoś wykorzystuje humor w celu ośmieszania lub poniżania innych.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Rzadko mówię zabawne rzeczy, które mogłyby mnie ośmieszyć.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zazwyczaj nie lubię opowiadać dowcipów ani rozśmieszać ludzi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kiedy jestem sam(a) i czuję się nieszczęśliwy(a), staram się myśleć o czymś zabawnym, aby poprawić sobie humor.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Czasami kiedy myślę o czymś zabawnym, nie mogę się powstrzymać od opowiedzenia o tym, nawet jeśli wiem, że jest to niestosowne w danej sytuacji.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Często przekraczam granicę w ośmieszaniu siebie, kiedy opowiadam dowcipy lub staram się być zabawny(a).",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Sprawia mi przyjemność rozśmieszanie ludzi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zazwyczaj, kiedy jestem smutny(a), tracę poczucie humoru.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nigdy nie wyśmiewam się z innych, nawet jeśli robią to moi przyjaciele.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kiedy jestem ze znajomymi lub rodziną często mam wrażenie, że to ze mnie się śmieją lub żartują.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Rzadko wygłupiam się z moimi przyjaciółmi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Z doświadczenia wiem, że myślenie o jakimś zabawnym aspekcie sytuacji często jest bardzo dobrym sposobem radzenia sobie z problemami.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jeśli kogoś nie lubię często posługuję się żartem lub kpiną aby go ośmieszyć lub poniżyć.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jeśli mam problemy lub czuję się nieszczęśliwy(a), często ukrywam to żartując i nawet moi najbliżsi przyjaciele nie wiedzą co naprawdę czuję.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zazwyczaj nie przychodzi mi do głowy nic zabawnego, kiedy jestem w towarzystwie innych ludzi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nie potrzebuję towarzystwa innych ludzi, aby czuć się rozbawiony(a) – zazwyczaj znajduję powody do śmiechu nawet, kiedy jestem sam(a).",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nawet jeśli coś jest dla mnie bardzo zabawne nie będę się z tego śmiać ani żartować jeśli wiem, że może to kogoś urazić.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Pozwalanie innym na śmianie się ze mnie jest sposobem na utrzymanie moich przyjaciół i rodziny w dobrym nastroju.",
                                min: 1,
                                max: 5,
                                value: -1
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
