export const qTypes = [
    {
        id: "1.1",
        name: "Przed badaniem",
        questionnaires: [
            {
                name: "Kwestionariusz IPIP-BFM-20",
                language: "pl",
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
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Niezbyt obchodzą mnie inni ludzie.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Zostawiam moje rzeczy gdzie popadnie.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Zwykle jestem zrelaksowany/a.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Mam bogate słownictwo.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Trzymam się z boku.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Jestem wyrozumiały/a dla uczuć innych ludzi.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Bez zwłoki wypełniam codzienne obowiązki.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Często martwię się czymś.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Mam trudności ze zrozumieniem abstrakcyjnych pojęć.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Rozmawiam z wieloma różnymi ludźmi na przyjęciach.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Nie interesują mnie problemy innych ludzi.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Często zapominam odkładać rzeczy na miejsce.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Rzadko czuję się przygnębiony/a.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Mam głowę pełną pomysłów.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Wśród nieznajomych jestem małomówny/a.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Znajduję czas dla innych.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Postępuję zgodnie z harmonogramem.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Często miewam huśtawki nastrojów.",
                                type: "scale",
                                min: 1,
                                max: 5,
                                value: -1,
                            },
                            {
                                text: "Nie mam zbyt bogatej wyobraźni.",
                                type: "scale",
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
                                        text: "Niebinarny",
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
                                text: "Jaki jest Pana/Pani wiek w latach (proszę wpisać tylko liczbę)?",
                            },
                            {
                                type: "text",
                                header: "[Narodowość]",
                                text: "Jakiej jest Pani/Pana narodowości? (np. Polak)",
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
                                text: "Czy ma Pani/Pan dzieci w wieku poniżej 18 lat?",
                                options: [
                                    {
                                        text: "Tak: proszę wymienić liczbę dzieci w polu odpowiedzi otwartej (tu odpowiedź otwarta)",
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
                                text: "Czy ma Pani/Pan inne obowiązki związane z opieką nad dziećmi?",
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
                                        text: "Samotny",
                                    },
                                    {
                                        text: "W związku, ale nie mieszkam razem",
                                    },
                                    {
                                        text: "Zamężna lub mieszkająca razem",
                                    },
                                    {
                                        text: "Owdowiały",
                                    },
                                    {
                                        text: "Rozwiedziony lub w separacji",
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
                                text: "Ile osób, łącznie z Panem/Panią, mieszka w gospodarstwie domowym?",
                            },
                            {
                                type: "radio",
                                header: "[Wykształcenie]",
                                text: "Jaki jest Pana(i) poziom wykształcenia?",
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
                                text: "Czy jest Pan(i) osobą religijną?",
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
                                    },
                                    {
                                        text: "Prawicowe (dominacja własności prywatnej, ograniczenie interwencjonizmu państwowego, niskie podatki, ograniczone ramy polityki socjalnej państwa)",
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                text: "Oś światopoglądowa/społeczna:",
                                options: [
                                    {
                                        text: "Liberalne (akceptacja związków homoseksualnych, transseksualizmu, aborcji, egalitarność)",
                                    },
                                    {
                                        text: "Konserwatywne (ważne wartości to rodzina, naród, tradycja, hierarchia społeczna)",
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
                language: "pl",
                segments: [
                    {
                        scales: {
                            description: "Pytania od Q1 do Q32 należy oceniać w skali całkowitoliczbowej od 1 do 5, gdzie:",
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
                                type: "scale",
                                text: "Zazwyczaj nie śmieję się i nie żartuję zbytnio z innymi ludźmi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Jeśli czuję się przygnębiony, zwykle mogę się rozweselić humorem.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Jeśli ktoś popełni błąd, często będę tym dokuczać.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Pozwalam ludziom śmiać się ze mnie lub żartować moim kosztem bardziej niż powinienem.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Nie muszę ciężko pracować nad rozśmieszaniem innych ludzi — wydaje mi się, że jestem osobą z natury dowcipną.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Nawet gdy jestem sam, często bawią mnie absurdy życia.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Ludzie nigdy nie są urażeni ani zranieni moim poczuciem humoru.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Często daję się ponieść umniejszaniu sobie, jeśli rozśmiesza to moją rodzinę lub przyjaciół.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Rzadko rozśmieszam innych ludzi opowiadając zabawne historie o sobie.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Jeśli czuję się zdenerwowany lub nieszczęśliwy, zwykle staram się wymyślić coś zabawnego w tej sytuacji, aby poczuć się lepiej.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Kiedy opowiadam dowcipy lub mówię śmieszne rzeczy, zwykle nie przejmuję się tym, jak inni ludzie to odbierają.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Często staram się, aby ludzie bardziej mnie polubili lub zaakceptowali, mówiąc coś śmiesznego o moich własnych słabościach, błędach lub wadach.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Z najbliższymi przyjaciółmi dużo się śmieję i żartuję.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Moje humorystyczne spojrzenie na życie powstrzymuje mnie przed nadmiernym denerwowaniem się lub przygnębieniem z powodu różnych rzeczy.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Nie lubię, gdy ludzie używają humoru jako sposobu na krytykowanie lub poniżanie kogoś.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Rzadko używam humoru, by sobie umniejszać.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Zazwyczaj nie lubię opowiadać dowcipów ani bawić ludzi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Jeśli jestem sam i czuję się nieszczęśliwy, staram się wymyślić coś zabawnego, aby podnieść się na duchu.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Czasami myślę o czymś, co jest tak zabawne, że nie mogę się powstrzymać przed powiedzeniem tego, nawet jeśli nie jest to odpowiednie do sytuacji.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Często przekraczam granicę w umniejszaniu sobie, kiedy robię sobie żarty lub próbuję być zabawny.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Lubię bawić ludzi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Jeśli czuję się smutny lub zdenerwowany, zwykle tracę poczucie humoru.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Nigdy nie śmieję się z innych, nawet jeśli robią to wszyscy moi znajomi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Kiedy jestem z przyjaciółmi lub rodziną, często wydaję się być tym, z którego inni ludzie się śmieją lub z którego żartują.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Nieczęsto żartuję z przyjaciółmi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Z mojego doświadczenia wynika, że myślenie o jakimś zabawnym aspekcie sytuacji jest często bardzo skutecznym sposobem radzenia sobie z problemami.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Jeśli kogoś nie lubię, często używam humoru lub przekomarzania się, aby mu umniejszyć.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Jeśli mam problemy lub czuję się nieszczęśliwy, często ukrywam to przez żarty, aby nawet moi najbliżsi przyjaciele nie wiedzieli, jak naprawdę się czuję.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Zwykle nie potrafię wymyślić dowcipnych rzeczy do powiedzenia, gdy jestem z innymi ludźmi.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Nie muszę przebywać z innymi ludźmi, żeby czuć się rozbawiony - zwykle potrafię znaleźć rzeczy do śmiechu nawet wtedy, gdy jestem sam.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Nawet jeśli coś jest dla mnie naprawdę zabawne, nie będę się z tego śmiał ani żartował, jeśli ktoś będzie urażony.",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "scale",
                                text: "Pozwalając innym na śmianie się ze mnie jest moim sposobem na utrzymanie moich przyjaciół i rodziny w dobrym nastroju.",
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
