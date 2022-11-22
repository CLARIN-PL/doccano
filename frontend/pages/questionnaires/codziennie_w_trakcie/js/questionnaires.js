export const qTypes = [
    {
        name: "Rano (sen, stres)",
        id: "4.1",
        questionnaires: [
            {
                name: "Sen (rano)",
                language: "pl",
                segments: [
                    {
                        scales: {
                            values: [
                                {
                                    value: 1,
                                    text: "bardzo źle"
                                },
                                {
                                    value: 7,
                                    text: "bardzo dobrze"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Jak oceniasz jakość swojego snu ostatniej nocy?",
                                min: 1,
                                max: 7,
                                minLabel: "Bardzo źle",
                                maxLabel: "Bardzo dobrze",
                                value: -1,
                            }
                        ]
                    },
                    {
                        scales: {
                            values: [
                                {
                                    value: 1,
                                    text: "wcale niewypoczęty/a"
                                },
                                {
                                    value: 7,
                                    text: "w pełni wypoczęty/a"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "slider",
                                text: "Jak czułeś/aś się dziś rano?",
                                min: 1,
                                max: 7,
                                minLabel: "wcale niewypoczęty/a",
                                maxLabel: "w pełni wypoczęty/a",
                                value: -1,
                            }
                        ]
                    }
                ]
            },
            {
                name: "Stres (rano)",
                language: "pl",
                segments: [
                    {
                        description: "Poniżej podano kilka stwierdzeń, z którymi możesz się zgadzać lub nie. Używając skali 0 do 4 wskaż, w jakim stopniu zgadzasz się z każdym stwierdzeniem. Bądź szczery w swoich odpowiedziach.",
                        scales: {
                            values: [
                                {
                                    value: 0,
                                    text: "zupełnie się nie zgadzam"
                                },
                                {
                                    value: 1,
                                    text: "nie zgadzam się"
                                },
                                {
                                    value: 2,
                                    text: "nie mam zdania"
                                },
                                {
                                    value: 3,
                                    text: "nie mam zdania"
                                },
                                {
                                    value: 4,
                                    text: "zgadzam się"
                                },
                                {
                                    value: 5,
                                    text: "całkowicie się zgadzam"
                                }
                            ]
                        },
                        questions: [
                            {
                                type: "scale",
                                text: "Czuję się zestresowany, niespokojny, przytłoczony.",
                                value: -1,
                                min: 0,
                                max: 5,
                            },
                            {
                                type: "scale",
                                text: "Czuję, że panuję nad sytuacją, dobrze sobie radzę, mam wszystko pod kontrolą.",
                                value: -1,
                                min: 0,
                                max: 5,
                            }
                        ]
                    }
                ],
                footer: "<b>Źródło:</b> Gordon, A. M., & Mendes, W. B. (2021). A large-scale study of stress, emotions, and blood pressure in daily life using a digital platform. Proceedings of the National Academy of Sciences, 118(31). <br/> <b>Polska adaptacja:</b> Opracowanie własne"
            }
        ]
    },
    {
        id: "4.2",
        name: "Wieczorem (stres, zdrowie)",
        questionnaires: [
            {
                name: "Stres (wieczorem)",
                language: "pl",
                segments: [
                    {
                    scales: {
                        values: [
                            {
                                value: 0,
                                text: "zupełnie się nie zgadzam"
                            },
                            {
                                value: 1,
                                text: "nie zgadzam się"
                            },
                            {
                                value: 2,
                                text: "nie mam zdania"
                            },
                            {
                                value: 3,
                                text: "zgadzam się"
                            },
                            {
                                value: 4,
                                text: "całkowicie się zgadzam"
                            }
                        ]
                    },
                    questions: [
                        {
                            type: "scale",
                            text: "Czuję, że wszystko mnie teraz przytłacza.",
                            min: 0,
                            max: 4,
                            value: -1
                        },
                        {
                            
                            type: "scale",
                            text: "Czuję, że wszystko jest teraz nieprzewidywalne.",
                            min: 0,
                            max: 4,
                            value: -1
                        }
                    ],
                        }
                    ],
                footer: "<b>Źródło:</b> Gordon, A. M., & Mendes, W. B. (2021). A large-scale study of stress, emotions, and blood pressure in daily life using a digital platform. Proceedings of the National Academy of Sciences, 118(31). <br/> <b>Polska adaptacja:</b> Opracowanie własne"
                },
                {
                    name: "Zdrowie (wieczorem)",
                    language: "pl",
                    segments: [
                        {
                            scales: {
                                values: [
                                    {
                                        value: 0,
                                        text: "źle"
                                    },
                                    {
                                        value: 1,
                                        text: "średnio"
                                    },
                                    {
                                        value: 2,
                                        text: "dobrze"
                                    },
                                    {
                                        value: 3,
                                        text: "bardzo dobrze"
                                    },
                                    {
                                        value: 4,
                                        text: "doskonale"
                                    }
                                ]
                            },
                            questions: [
                                {
                                    type: "scale",
                                    text: "Jak oceniasz stan swojego zdrowia?",
                                    min: 0,
                                    max: 4,
                                    value: -1
                                }
                            ],
                        }
                    ],
                    footer: "<b>Źródło:</b> Gordon, A. M., & Mendes, W. B. (2021). A large-scale study of stress, emotions, and blood pressure in daily life using a digital platform. Proceedings of the National Academy of Sciences, 118(31). <br/> <b>Polska adaptacja:</b> Opracowanie własne"
            }
        ]
    },
    {
        name: "W przerwie (emocje)",
        id: "4.3",
        questionnaires: [
            {
                name: "Emocje (w przerwie)",
                language: "pl",
                segments: [
                    {
                        questions: [
                            {
                                type: "radio",
                                text: "Czy właśnie czułeś silną emocję?",
                                
                                options: [
                                    {
                                        text: "Tak",
                                        value: 1
                                    },
                                    {
                                        text: "Nie",
                                        value: -1
                                    }
                                ]
                            },
                            {
                                text: "Jak się czułaś:",
                                subquestions: [
                                    {
                                        type: "slider",
                                        min: 0,
                                        max: 100,
                                        value: -1,
                                        minLabel: "Negatywnie",
                                        maxLabel: "Pozytywnie"
                                    },
                                    {
                                        type: "slider",
                                        min: 0,
                                        max: 100,
                                        value: -1,
                                        minLabel: "Ospały",
                                        maxLabel: "Bardzo pobudzony"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                footer: "<b>Źródło:</b> Saganowski, S., Behnke, M., Komoszyńska, J., Kunc, D., Perz, B., & Kazienko, P. (2021, September). A system for collecting emotionally annotated physiological signals in daily life using wearables. In 2021 9th International Conference on Affective Computing and Intelligent Interaction Workshops and Demos (ACIIW) (pp. 1-3). IEEE."        
            }
        ]
       }
]