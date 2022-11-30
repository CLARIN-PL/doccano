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
                                text: "Czuję się zestresowany, niespokojny, przytłoczony.",
                                value: -1,
                                min: 0,
                                max: 4,
                            },
                            {
                                type: "scale",
                                text: "Czuję, że panuję nad sytuacją, dobrze sobie radzę, mam wszystko pod kontrolą.",
                                value: -1,
                                min: 0,
                                max: 4,
                            }
                        ]
                    }
                ]
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
                        ]
                    }
                ]
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
                        ]
                    }
                ]
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
                                    },
                                    {
                                        text: "Nie",
                                    }
                                ]
                            },
                            {
                                text: "Jak się czułaś: Neg-Pos",
                                type: "slider",
                                min: 0,
                                max: 100,
                                value: -1,
                                minLabel: "Negatywnie",
                                maxLabel: "Pozytywnie"
                            },
                            {
                                text: "Jak się czułaś: Ospały-Bardzo pobudzony",
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
        ]
    }
]
