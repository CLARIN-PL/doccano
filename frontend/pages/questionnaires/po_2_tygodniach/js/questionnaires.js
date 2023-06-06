export const qTypes = [
    {
        id: "6.1",
        name: "Ankieta po 2 tygodniach badania",
        questionnaires: [
            {
                name: "Ankieta po 2 tygodniach badania",
                language: "pl",
                id: 19,
                typeId: "6.1",
                segments: [
                    {
                        scales: {
                            description: "Webinarium",
                        },
                        questions: [
                            {
                                type: "radio",
                                text: "Czy spotkanie na Google Meets było problematyczne?",
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
                                text: "Czy wolałabyś/wolałbyś spotkanie na Zoom?",
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
                                type: "text",
                                text: "Czy wolałabyś/wolałbyś spotkanie na innej platformie (jakiej)?"
                            },
                            {
                                type: "radio",
                                text: "Czy korzystałeś/korzystałaś z kontaktu z osobą odpowiedzialną za rozwiązywanie problemów i wsparcie?",
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
                                type: "text",
                                text: "Czy masz jakieś pomysły/sugestie dotyczące webinarium?"
                            }
                        ]
                    },
                    {
                        scales: {
                            description: "Anotacja",
                        },
                        questions: [
                            {
                                type: "text",
                                text: "Jak często powinno się robić przerwy w pracy anotacyjnej?"
                            },
                            {
                                type: "text",
                                text: "Jak długie powinno się robić przerwy w pracy anotacyjnej?"
                            },
                            {
                                type: "radio",
                                text: "Czy któreś pytanie/polecenie dotyczące tekstu było niezrozumiałe?",
                                options: [
                                    {
                                        text: "Tak",
                                        showDynamicSelectInput: true,
                                        dynamicSelectInput: {
                                            showAddButton: true,
                                            prependOptions: [
                                                {
                                                    text: "Wybierz opcję",
                                                    isSelectable: false
                                                }
                                            ],
                                            options: [
                                                {
                                                    showTextbox: true,
                                                    text: "Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Dlaczego?",
                                                },
                                                {
                                                    showTextbox: true,
                                                    text: "Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Dlaczego?",
                                                },
                                                {
                                                    showTextbox: true,
                                                    text: "Czy tekst wzbudza w Tobie jakiekolwiek emocje? Dlaczego?",
                                                },
                                                {
                                                    showTextbox: true,
                                                    text: "etc? Dlaczego?",
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        text: "Nie"
                                    }
                                ]
                            },
                            {
                                type: "radio",
                                text: "Tekstów było?",
                                alternateText: "Tekstów było?Jaka liczba tekstów byłaby odpowiednia?",
                                options: [
                                    {
                                        text: "za dużo",
                                        question: "Jaka liczba tekstów byłaby odpowiednia?",
                                        showTextbox: true,
                                        numericOnly: true
                                    },
                                    {
                                        text: "za mało",
                                        question: "Jaka liczba tekstów byłaby odpowiednia?",
                                        showTextbox: true,
                                        numericOnly: true
                                    },
                                    {
                                        text: "w sam raz"
                                    }
                                ]
                            },
                            {
                                type: "text",
                                text: "Co byś zmieniła/zmienił w badaniu?"
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
