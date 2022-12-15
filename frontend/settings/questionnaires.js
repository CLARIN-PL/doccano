
export const qCategories = [
    {
        id: "1",
        name: "Przed badaniem",
        key: "przed_badaniem",
        types: [
            {
                id: "1.1",
                name: "Przed badaniem",
                count: 3,
                questionnaires: [1, 2, 3]
            }
        ]
    },
    {
        id: "2",
        name: "Przed i po badaniu",
        key: "przed_i_po_badaniu",
        types: [
            {
                id: "2.1",
                name: "Przed i po badaniu (przed badaniem)",
                count: 8,
                questionnaires: [4, 5, 6, 7, 8, 9, 10, 11]
            },
            {
                id: "2.2",
                name: "Przed i po badaniu (po badaniu)",
                count: 8,
                questionnaires: [4, 5, 6, 7, 8, 9, 10, 11]
            }
        ]
    },
    {
        id: "3",
        name: "Po pierwszym tygodniu i na końcu badań",
        key: "po_1_tygodniu_i_na_koncu",
        types: [
            {
                id: "3.1",
                name: "Po pierwszym tygodniu",
                count: 1, 
                questionnaires: [12]
            },
            {
                id: "3.2",
                name: "Na końcu badań",
                count: 1,
                questionnaires: [12]
            }
        ]
    }, 
    {
        id: "4",
        name: "Codziennie w trakcie badania",
        key: "codziennie_w_trakcie",
        types: [
            {
                id: "4.1",
                name: "Sen (rano)",
                description: "Rano (sen, stres)",
                count: 2,
                questionnaires: [13, 14]
            },
            {
                id: "4.2",
                name: "Wieczorem (stres, zdrowie)",
                count: 2, 
                questionnaires: [15, 16]
            },
            {
                id: "4.3",
                name: "W przerwie (emocje)",
                questionnaires: [17],
                count: 1,
            },
        ]
    },
    {
        id: "5",
        name: "Ankieta na koniec badania",
        key: "na_koniec",
        types: [
            {
                id: "5.1",
                name: "Ankieta na koniec badania",
                count: 1,
                questionnaires: [18]
            }
        ]
    },
    {
        id: "6",
        name: "Ankieta po 2 tygodniach badania",
        key: "po_2_tygodniach",
        types: [
            {
                id: "6.1",
                name: "Ankieta po 2 tygodniach badania",
                count: 1,
                questionnaires: [19]
            }
        ]
    }
]
