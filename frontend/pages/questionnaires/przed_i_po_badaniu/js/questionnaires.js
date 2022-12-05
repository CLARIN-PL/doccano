export const qTypes = [
    {
        id: "2.1",
        name: "Przed i po badaniu (przed badaniem)",
        questionnaires: [
            {
                name: "SWLS-A",
                language: "pl",
                type: "dobrostan: satysfakcja z życia",
                segments: [
                    {
                        scales: {
                            description: "Poniżej podano kilka stwierdzeń, z którymi możesz się zgadzać lub nie. Używając skali 1 do 7 wskaż, w jakim stopniu zgadzasz się z każdym stwierdzeniem. Bądź szczery w swoich odpowiedziach.",
                            values: [
                                {
                                    value: 1,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 2,
                                    text: "nie zgadzam się"
                                },
                                {
                                    value: 3,
                                    text: "raczej nie zgadzam się"
                                },
                                {
                                    value: 4,
                                    text: "ani się zgadzam ani się nie zgadzam"
                                },
                                {
                                    value: 5,
                                    text: "raczej zgadzam się"
                                },
                                {
                                    value: 6,
                                    text: "zgadzam się"
                                },
                                {
                                    value: 7,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Pod wieloma względami moje życie jest zbliżone do ideału.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Warunki mojego życia są doskonałe.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jestem zadowolony/a z mojego życia.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "W życiu osiągnąłem/osiągnęłam najważniejsze rzeczy, które chciałem/am.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Gdybym mógł/mogła jeszcze raz przeżyć swoje życie, to nie chciałbym/chciałabym prawie nic zmienić.",
                                min: 1,
                                max: 7,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "SPANE",
                language: "pl",
                type: "dobrostan: afekt",
                segments: [
                    {
                        scales: {
                            description: "Zastanów się proszę, co robiłeś/-aś i czego doświadczałeś/-aś w ciągu ostatnich 4 tygodni. Następnie zaznacz, jak często doświadczałeś/-aś każdego z następujących stanów i uczuć, korzystając z poniższej skali. Dla każdej pozycji wybierz cyfrę od 1 do 5 i zaznacz ją na arkuszu odpowiedzi.",
                            values: [
                                {
                                    value: 1,
                                    text: "Bardzo rzadko lub nigdy"
                                },
                                {
                                    value: 2,
                                    text: "Rzadko"
                                },
                                {
                                    value: 3,
                                    text: "Czasami"
                                },
                                {
                                    value: 4,
                                    text: "Często"
                                },
                                {
                                    value: 5,
                                    text: "Bardzo często lub zawsze"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Pozytywnie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Negatywnie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Dobrze",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Źle",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Przyjemnie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nieprzyjemnie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Szczęśliwy/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Smutny/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Przestraszony/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Radosny/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Rozgniewany/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zadowolony/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "Skala Prosperowania",
                language: "pl",
                type: "dobrostan: skala prosperowania",
                segments: [
                    {
                        scales: {
                            description: "Poniżej znajduje się 8 stwierdzeń, z którymi możesz się zgodzić lub nie. Korzystając ze skali od 1 do 7 wskaż, w jakim stopniu zgadzasz się z każdym zdaniem.",
                            values: [
                                {
                                    value: 1,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 2,
                                    text: "nie zgadzam się"
                                },
                                {
                                    value: 3,
                                    text: "raczej nie zgadzam się"
                                },
                                {
                                    value: 4,
                                    text: "ani się zgadzam ani się nie zgadzam"
                                },
                                {
                                    value: 5,
                                    text: "raczej zgadzam się"
                                },
                                {
                                    value: 6,
                                    text: "zgadzam się"
                                },
                                {
                                    value: 7,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Prowadzę życie, które ma sens i cel.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Moje relacje społeczne są wspierające i dają mi satysfakcję.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Angażuję się i interesuję tym, czym zajmuję się na co dzień.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Aktywnie przyczyniam się do szczęścia i dobrostanu innych.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jestem kompetentny i zdolny do wykonywania zajęć, które są dla mnie ważne.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jestem dobrym człowiekiem i prowadzę dobre życie.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Z optymizmem patrzę na swoją przyszłość.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Ludzie mnie szanują.",
                                min: 1,
                                max: 7,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "Kwestionariusz Zdrowia Pacjenta PHQ-9 (PHQ-9)",
                language: "pl",
                type: "depresja",
                segments: [
                    {
                        scales: {
                            description: "Patient Health Questionnaire, jest przeznaczony do przesiewowego wykrywania depresji, wykorzystywany jest we wstępnej diagnozie. Jak często w ciągu ostatnich 2 tygodni dokuczały panu/pani następujące problemy?",
                            values: [
                                {
                                    value: 0,
                                    text: "wcale nie dokuczały"
                                },
                                {
                                    value: 1,
                                    text: "kilka dni"
                                },
                                {
                                    value: 2,
                                    text: "więcej niż połowę dni"
                                },
                                {
                                    value: 3,
                                    text: "niemal codziennie"
                                },
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Niewielkie zainteresowanie lub odczuwanie przyjemności z wykonywania czynności.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Uczucie smutku, przygnębienia lub beznadziejności.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kłopoty z zaśnięciem lub przerywany sen, albo zbyt długi sen.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Uczucie zmęczenia lub brak energii.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Brak apetytu lub przejadanie się.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Poczucie niezadowolenia z siebie — lub uczucie, że jest się do niczego, albo że zawiódł/zawiodła Pan/Pani siebie lub rodzinę.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Problemy ze skupieniem się na przykład przy czytaniu gazety lub oglądaniu telewizji.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Poruszanie się lub mówienie tak wolno, że inni mogliby to zauważyć? Albo wręcz przeciwnie — niemożność usiedzenia w miejscu lub podenerwowanie powodujące ruchliwość znacznie większą niż zwykle.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Myśli, że lepiej byłoby umrzeć, albo chęć zrobienia sobie jakiejś krzywdy.",
                                min: 0,
                                max: 3,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "Kwestionariusz PSS",
                language: "pl",
                type: "stres",
                segments: [
                    {
                        scales: {
                            description: "Pytania zawarte w tej skali dotyczą Twoich myśli i odczuć związanych z doświadczanymi w ostatnim miesiącu zdarzeniami. Mimo znacznych podobieństw są to różne pytania i każde z nich należy traktować oddzielnie. W każdym pytaniu wskaż — jak często myślałeś/aś i odczuwałeś/aś w podany sposób, wykorzystując skalę po prawej stronie:",
                            values: [
                                {
                                    value: 0,
                                    text: "nigdy"
                                },
                                {
                                    value: 1,
                                    text: "prawie nigdy"
                                },
                                {
                                    value: 2,
                                    text: "czasem"
                                },
                                {
                                    value: 3,
                                    text: "dość często"
                                },
                                {
                                    value: 4,
                                    text: "bardzo często"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca byłeś/aś zdenerwowany/a, ponieważ zdarzyło się coś niespodziewanego?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca czułeś/aś, że ważne sprawy w twoim życiu wymykają ci się spod kontroli?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca odczuwałeś/aś zdenerwowanie i napięcie?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca byłeś/aś przekonany/a, że jesteś w stanie poradzić sobie z problemami osobistymi?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca czułeś/aś, że sprawy układają się po twojej myśli?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca stwierdzałeś/aś, że nie radzisz sobie ze wszystkimi obowiązkami?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca potrafiłeś/aś opanować swoje rozdrażnienie?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca czułeś/aś, że wszystko ci wychodzi?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca złościłeś/aś się, ponieważ nie miałeś/aś wpływu na to co się zdarzyło?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca czułeś/aś, że nie możesz przezwyciężyć narastających trudności?",
                                min: 0,
                                max: 4,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "Physical Health Questionnaire",
                language: "pl",
                type: "zdrowie",
                segments: [
                    {
                        scales: {
                            description: "Poniższe punkty dotyczą tego, jak się Pan(i) czuł(a) fizycznie w ciągu ostatnich 4 tygodni. W ciągu ostatnich 4 tygodni...",
                            values: [
                                {
                                    value: 1,
                                    text: "Wcale"
                                },
                                {
                                    value: 2,
                                    text: "Rzadko"
                                },
                                {
                                    value: 3,
                                    text: "Raz na jakiś czas"
                                },
                                {
                                    value: 4,
                                    text: "Czasami"
                                },
                                {
                                    value: 5,
                                    text: "Dość często"
                                },
                                {
                                    value: 6,
                                    text: "Często"
                                },
                                {
                                    value: 7,
                                    text: "Cały czas"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś trudności z zasypianiem w nocy?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często budziłeś/aś się w nocy?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś koszmary senne lub niepokojące sny?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często Twój sen był spokojny i niezakłócony?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś bóle głowy?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często bolała Cię głowa, gdy wywierano się na Ciebie dużą presję, aby załatwić sprawy?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często bolała Cię głowa, gdy byłeś/aś sfrustrowany/a, ponieważ sprawy nie ułożyły się tak, jak powinny, lub gdy byłeś/aś na kogoś zirytowany/a?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często cierpiałeś/aś z powodu rozstroju żołądka (niestrawności)?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często musiałeś/aś uważać na to, co jesz, aby uniknąć rozstroju żołądka?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś mdłości lub inne problemy żołądkowe?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś zaparcia lub cierpiałeś na biegunkę?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "radio",
                                text: "Ile razy miałeś/aś drobne przeziębienie (np. takie które sprawiło, że czułeś/aś się niekomfortowo, ale nie zatrzymało Cię ono w łóżku ani nie spowodowało, że opuściłeś/aś pracę)?",
                                options: [
                                    {
                                        text: "0 razy"
                                    },
                                    {
                                        text: "1-2 razy"
                                    },
                                    {
                                        text: "3 razy"
                                    },
                                    {
                                        text: "4 razy"
                                    },
                                    {
                                        text: "5 razy"
                                    },
                                    {
                                        text: "6 razy"
                                    },
                                    {
                                        text: "7 razy"
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                text: "Ile razy miałeś/aś infekcje dróg oddechowych, poważniejsze niż drobne przeziębienie (np. takie które 'rozłożyły' cię na łopatki - zapalenie oskrzeli, zapalenie zatok itp.)?",
                                options: [
                                    {
                                        text: "0 razy"
                                    },
                                    {
                                        text: "1-2 razy"
                                    },
                                    {
                                        text: "3 razy"
                                    },
                                    {
                                        text: "4 razy"
                                    },
                                    {
                                        text: "5 razy"
                                    },
                                    {
                                        text: "6 razy"
                                    },
                                    {
                                        text: "7 razy"
                                    }
                                ]
                            },
                            {
                                type: "slider",
                                text: "Jak długo na ogół trwało przeziębienie lub grypa, które przechodziłeś/aś (dni)?",
                                alternateText: "Jak długo na ogół trwało przeziębienie lub grypa, które przechodziłeś/aś?",
                                min: 1,
                                max: 7,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "List of RESS-EMA Items",
                language: "pl",
                type: "regulacja emocji",
                segments: [
                    {
                        scales: {
                            description: "Zastanów się proszę, co robiłeś/-aś gdy doświadczałeś/-aś emocji w ciągu ostatnich 4 tygodni. Używając skali 0 do 100 wskaż, w jakim stopniu zgadzasz się z każdym stwierdzeniem. Bądź szczery w swoich odpowiedziach. <br/>Realizacja poprzez suwaki w aplikacji. <br/>Gdy odczuwałem/-łam emocje...",
                            values: [
                                {
                                    value: 0,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 100,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Starałem/am się zwolnić tętno i oddech.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Wziąłem/am głęboki oddech.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Okazałem/am swoje uczucia.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Wyraziłem/am swoje uczucia.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "W kółko myślałem/am o tym wydarzeniu emocjonalnym.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Ciągle myślałem/am o tym, co mi przeszkadzało.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Myślałem/am o innych sposobach interpretacji sytuacji.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Spojrzałem/am na sytuację z kilku różnych punktów widzenia.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zaangażowałem/am się w coś innego, żeby mieć zajęcie.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zaangażowałem/am się w jakieś czynności, żeby odwrócić swoją uwagę.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Starałem/am się ukryć swoje uczucia.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Udawałem/am, że wcale nie odczuwam emocji, którą odczuwałem/am.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "PAQ",
                language: "pl",
                type: "alexytymia",
                segments: [
                    {
                        scales: {
                            description: "W tym kwestionariuszu pytamy o to, jak postrzegasz i przeżywasz swoje emocje. Proszę ocenić poniższe stwierdzenia w zależności od tego, na ile zgadzasz się lub nie zgadzasz, że dane stwierdzenie jest prawdziwe w odniesieniu do Ciebie. Zakreśl kółkiem jedną odpowiedź dla każdego stwierdzenia. <br/>Niektóre pytania mówią o złych lub nieprzyjemnych emocjach, co oznacza emocje takie jak smutek, złość lub strach.. Niektóre pytania mówią o dobrych lub przyjemnych emocjach, co oznacza takie emocje jak szczęście, rozbawienie lub ekscytacja.",
                            values: [
                                {
                                    value: 1,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 2,
                                    text: "nie zgadzam się"
                                },
                                {
                                    value: 3,
                                    text: "raczej nie zgadzam się"
                                },
                                {
                                    value: 4,
                                    text: "ani się zgadzam ani się nie zgadzam"
                                },
                                {
                                    value: 5,
                                    text: "raczej zgadzam się"
                                },
                                {
                                    value: 6,
                                    text: "zgadzam się"
                                },
                                {
                                    value: 7,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Kiedy czuję się źle (odczuwam nieprzyjemne emocje), nie potrafię znaleźć odpowiednich słów, by opisać te uczucia.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kiedy czuję się źle, nie potrafię powiedzieć, czy jestem smutny, zły czy przestraszony.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Mam skłonność do ignorowania tego, co czuję.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kiedy czuję się dobrze (odczuwam przyjemne emocje), nie potrafię znaleźć odpowiednich słów, by opisać te uczucia.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kiedy czuję się dobrze, nie potrafię powiedzieć, czy jestem szczęśliwy, podekscytowany czy rozbawiony.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nie zwracam uwagi na swoje emocje.",
                                min: 1,
                                max: 7,
                                value: -1
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2.2",
        name: "Przed i po badaniu (po badaniu)",
        questionnaires: [
            {
                name: "SWLS-A",
                language: "pl",
                type: "dobrostan: satysfakcja z życia",
                segments: [
                    {
                        scales: {
                            description: "Poniżej podano kilka stwierdzeń, z którymi możesz się zgadzać lub nie. Używając skali 1 do 7 wskaż, w jakim stopniu zgadzasz się z każdym stwierdzeniem. Bądź szczery w swoich odpowiedziach.",
                            values: [
                                {
                                    value: 1,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 2,
                                    text: "nie zgadzam się"
                                },
                                {
                                    value: 3,
                                    text: "raczej nie zgadzam się"
                                },
                                {
                                    value: 4,
                                    text: "ani się zgadzam ani się nie zgadzam"
                                },
                                {
                                    value: 5,
                                    text: "raczej zgadzam się"
                                },
                                {
                                    value: 6,
                                    text: "zgadzam się"
                                },
                                {
                                    value: 7,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Pod wieloma względami moje życie jest zbliżone do ideału.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Warunki mojego życia są doskonałe.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jestem zadowolony/a z mojego życia.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "W życiu osiągnąłem/osiągnęłam najważniejsze rzeczy, które chciałem/am.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Gdybym mógł/mogła jeszcze raz przeżyć swoje życie, to nie chciałbym/chciałabym prawie nic zmienić.",
                                min: 1,
                                max: 7,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "SPANE",
                language: "pl",
                type: "dobrostan: afekt",
                segments: [
                    {
                        scales: {
                            description: "Zastanów się proszę, co robiłeś/-aś i czego doświadczałeś/-aś w ciągu ostatnich 4 tygodni. Następnie zaznacz, jak często doświadczałeś/-aś każdego z następujących stanów i uczuć, korzystając z poniższej skali. Dla każdej pozycji wybierz cyfrę od 1 do 5 i zaznacz ją na arkuszu odpowiedzi.",
                            values: [
                                {
                                    value: 1,
                                    text: "Bardzo rzadko lub nigdy"
                                },
                                {
                                    value: 2,
                                    text: "Rzadko"
                                },
                                {
                                    value: 3,
                                    text: "Czasami"
                                },
                                {
                                    value: 4,
                                    text: "Często"
                                },
                                {
                                    value: 5,
                                    text: "Bardzo często lub zawsze"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Pozytywnie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Negatywnie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Dobrze",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Źle",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Przyjemnie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nieprzyjemnie",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Szczęśliwy/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Smutny/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Przestraszony/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Radosny/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Rozgniewany/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zadowolony/-a",
                                min: 1,
                                max: 5,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "Skala Prosperowania",
                language: "pl",
                type: "dobrostan: skala prosperowania",
                segments: [
                    {
                        scales: {
                            description: "Poniżej znajduje się 8 stwierdzeń, z którymi możesz się zgodzić lub nie. Korzystając ze skali od 1 do 7 wskaż, w jakim stopniu zgadzasz się z każdym zdaniem.",
                            values: [
                                {
                                    value: 1,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 2,
                                    text: "nie zgadzam się"
                                },
                                {
                                    value: 3,
                                    text: "raczej nie zgadzam się"
                                },
                                {
                                    value: 4,
                                    text: "ani się zgadzam ani się nie zgadzam"
                                },
                                {
                                    value: 5,
                                    text: "raczej zgadzam się"
                                },
                                {
                                    value: 6,
                                    text: "zgadzam się"
                                },
                                {
                                    value: 7,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Prowadzę życie, które ma sens i cel.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Moje relacje społeczne są wspierające i dają mi satysfakcję.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Angażuję się i interesuję tym, czym zajmuję się na co dzień.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Aktywnie przyczyniam się do szczęścia i dobrostanu innych.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jestem kompetentny i zdolny do wykonywania zajęć, które są dla mnie ważne.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jestem dobrym człowiekiem i prowadzę dobre życie.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Z optymizmem patrzę na swoją przyszłość.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Ludzie mnie szanują.",
                                min: 1,
                                max: 7,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "Kwestionariusz Zdrowia Pacjenta PHQ-9 (PHQ-9)",
                language: "pl",
                type: "depresja",
                segments: [
                    {
                        scales: {
                            description: "Patient Health Questionnaire, jest przeznaczony do przesiewowego wykrywania depresji, wykorzystywany jest we wstępnej diagnozie. Jak często w ciągu ostatnich 2 tygodni dokuczały panu/pani następujące problemy?",
                            values: [
                                {
                                    value: 0,
                                    text: "wcale nie dokuczały"
                                },
                                {
                                    value: 1,
                                    text: "kilka dni"
                                },
                                {
                                    value: 2,
                                    text: "więcej niż połowę dni"
                                },
                                {
                                    value: 3,
                                    text: "niemal codziennie"
                                },
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Niewielkie zainteresowanie lub odczuwanie przyjemności z wykonywania czynności.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Uczucie smutku, przygnębienia lub beznadziejności.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kłopoty z zaśnięciem lub przerywany sen, albo zbyt długi sen.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Uczucie zmęczenia lub brak energii.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Brak apetytu lub przejadanie się.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Poczucie niezadowolenia z siebie — lub uczucie, że jest się do niczego, albo że zawiódł/zawiodła Pan/Pani siebie lub rodzinę.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Problemy ze skupieniem się na przykład przy czytaniu gazety lub oglądaniu telewizji.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Poruszanie się lub mówienie tak wolno, że inni mogliby to zauważyć? Albo wręcz przeciwnie — niemożność usiedzenia w miejscu lub podenerwowanie powodujące ruchliwość znacznie większą niż zwykle.",
                                min: 0,
                                max: 3,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Myśli, że lepiej byłoby umrzeć, albo chęć zrobienia sobie jakiejś krzywdy.",
                                min: 0,
                                max: 3,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "Kwestionariusz PSS",
                language: "pl",
                type: "stres",
                segments: [
                    {
                        scales: {
                            description: "Pytania zawarte w tej skali dotyczą Twoich myśli i odczuć związanych z doświadczanymi w ostatnim miesiącu zdarzeniami. Mimo znacznych podobieństw są to różne pytania i każde z nich należy traktować oddzielnie. W każdym pytaniu wskaż — jak często myślałeś/aś i odczuwałeś/aś w podany sposób, wykorzystując skalę po prawej stronie:",
                            values: [
                                {
                                    value: 0,
                                    text: "nigdy"
                                },
                                {
                                    value: 1,
                                    text: "prawie nigdy"
                                },
                                {
                                    value: 2,
                                    text: "czasem"
                                },
                                {
                                    value: 3,
                                    text: "dość często"
                                },
                                {
                                    value: 4,
                                    text: "bardzo często"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca byłeś/aś zdenerwowany/a, ponieważ zdarzyło się coś niespodziewanego?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca czułeś/aś, że ważne sprawy w twoim życiu wymykają ci się spod kontroli?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca odczuwałeś/aś zdenerwowanie i napięcie?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca byłeś/aś przekonany/a, że jesteś w stanie poradzić sobie z problemami osobistymi?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca czułeś/aś, że sprawy układają się po twojej myśli?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca stwierdzałeś/aś, że nie radzisz sobie ze wszystkimi obowiązkami?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca potrafiłeś/aś opanować swoje rozdrażnienie?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca czułeś/aś, że wszystko ci wychodzi?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca złościłeś/aś się, ponieważ nie miałeś/aś wpływu na to co się zdarzyło?",
                                min: 0,
                                max: 4,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często w ciągu ostatniego miesiąca czułeś/aś, że nie możesz przezwyciężyć narastających trudności?",
                                min: 0,
                                max: 4,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "Physical Health Questionnaire",
                language: "pl",
                type: "zdrowie",
                segments: [
                    {
                        scales: {
                            description: "Poniższe punkty dotyczą tego, jak się Pan(i) czuł(a) fizycznie w ciągu ostatnich 4 tygodni. W ciągu ostatnich 4 tygodni...",
                            values: [
                                {
                                    value: 1,
                                    text: "Wcale"
                                },
                                {
                                    value: 2,
                                    text: "Rzadko"
                                },
                                {
                                    value: 3,
                                    text: "Raz na jakiś czas"
                                },
                                {
                                    value: 4,
                                    text: "Czasami"
                                },
                                {
                                    value: 5,
                                    text: "Dość często"
                                },
                                {
                                    value: 6,
                                    text: "Często"
                                },
                                {
                                    value: 7,
                                    text: "Cały czas"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś trudności z zasypianiem w nocy?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często budziłeś/aś się w nocy?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś koszmary senne lub niepokojące sny?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często Twój sen był spokojny i niezakłócony?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś bóle głowy?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często bolała Cię głowa, gdy wywierano się na Ciebie dużą presję, aby załatwić sprawy?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często bolała Cię głowa, gdy byłeś/aś sfrustrowany/a, ponieważ sprawy nie ułożyły się tak, jak powinny, lub gdy byłeś/aś na kogoś zirytowany/a?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często cierpiałeś/aś z powodu rozstroju żołądka (niestrawności)?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często musiałeś/aś uważać na to, co jesz, aby uniknąć rozstroju żołądka?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś mdłości lub inne problemy żołądkowe?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Jak często miałeś/aś zaparcia lub cierpiałeś na biegunkę?",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "radio",
                                text: "Ile razy miałeś/aś drobne przeziębienie (np. takie które sprawiło, że czułeś/aś się niekomfortowo, ale nie zatrzymało Cię ono w łóżku ani nie spowodowało, że opuściłeś/aś pracę)?",
                                options: [
                                    {
                                        text: "0 razy"
                                    },
                                    {
                                        text: "1-2 razy"
                                    },
                                    {
                                        text: "3 razy"
                                    },
                                    {
                                        text: "4 razy"
                                    },
                                    {
                                        text: "5 razy"
                                    },
                                    {
                                        text: "6 razy"
                                    },
                                    {
                                        text: "7 razy"
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                text: "Ile razy miałeś/aś infekcje dróg oddechowych, poważniejsze niż drobne przeziębienie (np. takie które 'rozłożyły' cię na łopatki - zapalenie oskrzeli, zapalenie zatok itp.)?",
                                options: [
                                    {
                                        text: "0 razy"
                                    },
                                    {
                                        text: "1-2 razy"
                                    },
                                    {
                                        text: "3 razy"
                                    },
                                    {
                                        text: "4 razy"
                                    },
                                    {
                                        text: "5 razy"
                                    },
                                    {
                                        text: "6 razy"
                                    },
                                    {
                                        text: "7 razy"
                                    }
                                ]
                            },
                            {
                                type: "slider",
                                text: "Jak długo na ogół trwało przeziębienie lub grypa, które przechodziłeś/aś (dni)?",
                                alternateText: "Jak długo na ogół trwało przeziębienie lub grypa, które przechodziłeś/aś?",
                                min: 1,
                                max: 7,
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "List of RESS-EMA Items",
                language: "pl",
                type: "regulacja emocji",
                segments: [
                    {
                        scales: {
                            description: "Zastanów się proszę, co robiłeś/-aś gdy doświadczałeś/-aś emocji w ciągu ostatnich 4 tygodni. Używając skali 0 do 100 wskaż, w jakim stopniu zgadzasz się z każdym stwierdzeniem. Bądź szczery w swoich odpowiedziach. <br/>Realizacja poprzez suwaki w aplikacji. <br/>Gdy odczuwałem/-łam emocje...",
                            values: [
                                {
                                    value: 0,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 100,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Starałem/am się zwolnić tętno i oddech.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Wziąłem/am głęboki oddech.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Okazałem/am swoje uczucia.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Wyraziłem/am swoje uczucia.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "W kółko myślałem/am o tym wydarzeniu emocjonalnym.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Ciągle myślałem/am o tym, co mi przeszkadzało.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Myślałem/am o innych sposobach interpretacji sytuacji.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Spojrzałem/am na sytuację z kilku różnych punktów widzenia.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zaangażowałem/am się w coś innego, żeby mieć zajęcie.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Zaangażowałem/am się w jakieś czynności, żeby odwrócić swoją uwagę.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Starałem/am się ukryć swoje uczucia.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Udawałem/am, że wcale nie odczuwam emocji, którą odczuwałem/am.",
                                min: 0,
                                max: 100,
                                showTickLabels: false,
                                minLabel: "0",
                                maxLabel: "100",
                                value: -1
                            }
                        ]
                    }
                ]
            },
            {
                name: "PAQ",
                language: "pl",
                type: "alexytymia",
                segments: [
                    {
                        scales: {
                            description: "W tym kwestionariuszu pytamy o to, jak postrzegasz i przeżywasz swoje emocje. Proszę ocenić poniższe stwierdzenia w zależności od tego, na ile zgadzasz się lub nie zgadzasz, że dane stwierdzenie jest prawdziwe w odniesieniu do Ciebie. Zakreśl kółkiem jedną odpowiedź dla każdego stwierdzenia. <br/>Niektóre pytania mówią o złych lub nieprzyjemnych emocjach, co oznacza emocje takie jak smutek, złość lub strach.. Niektóre pytania mówią o dobrych lub przyjemnych emocjach, co oznacza takie emocje jak szczęście, rozbawienie lub ekscytacja.",
                            values: [
                                {
                                    value: 1,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 2,
                                    text: "nie zgadzam się"
                                },
                                {
                                    value: 3,
                                    text: "raczej nie zgadzam się"
                                },
                                {
                                    value: 4,
                                    text: "ani się zgadzam ani się nie zgadzam"
                                },
                                {
                                    value: 5,
                                    text: "raczej zgadzam się"
                                },
                                {
                                    value: 6,
                                    text: "zgadzam się"
                                },
                                {
                                    value: 7,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Kiedy czuję się źle (odczuwam nieprzyjemne emocje), nie potrafię znaleźć odpowiednich słów, by opisać te uczucia.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kiedy czuję się źle, nie potrafię powiedzieć, czy jestem smutny, zły czy przestraszony.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Mam skłonność do ignorowania tego, co czuję.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kiedy czuję się dobrze (odczuwam przyjemne emocje), nie potrafię znaleźć odpowiednich słów, by opisać te uczucia.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Kiedy czuję się dobrze, nie potrafię powiedzieć, czy jestem szczęśliwy, podekscytowany czy rozbawiony.",
                                min: 1,
                                max: 7,
                                value: -1
                            },
                            {
                                type: "slider",
                                text: "Nie zwracam uwagi na swoje emocje.",
                                min: 1,
                                max: 7,
                                value: -1
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
