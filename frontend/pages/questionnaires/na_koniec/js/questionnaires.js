export const qTypes = [
    {
        name: "Ankieta na koniec badania",
        id: "5.1",
        questionnaires: [
            {
                name: "Ankieta na koniec badania",
                language: "pl",
                segments: [
                    {
                        questions: [
                            {
                                type: "text",
                                text: "Jak często powinno się robić przerwy w pracy anotacyjnej?",
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
                                        showTextbox: true
                                    },
                                    {
                                        text: "za mało",
                                        question: "Jaka liczba tekstów byłaby odpowiednia?",
                                        showTextbox: true
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
