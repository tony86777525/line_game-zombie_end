module.exports = {
    gameStatesId: 3,

    route: './src/model/game4',

    selectNumber: {1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十'},

    step: {
        join_game: 1,
        select_number: 2,
        check_role: 3
    },

    user: {
        min_count: 5,
        max_count: 10,
        type: {
            user: 1,
            robot: 0
        }
    },

    role: {
        card: {
            1: {type: 1, power: 1, winner: 1, image: 'people1.png'},
            2: {type: 1, power: 1, winner: 1, image: 'people2.png'},
            3: {type: 1, power: 1, winner: 1, image: 'people3.png'},
            4: {type: 1, power: 1, winner: 1, image: 'people4.png'},
            5: {type: 1, power: 1, winner: 1, image: 'people5.png'},
            6: {type: 1, power: 1, winner: 1, image: 'people6.png'},
            7: {type: 2, power: 2, winner: 2, image: 'infected1.png'},
            8: {type: 2, power: 2, winner: 2, image: 'infected2.png'},
            9: {type: 2, power: 2, winner: 2, image: 'infected3.png'},
            10: {type: 2, power: 2, winner: 2, image: 'infected4.png'},
            11: {type: 2, power: 3, winner: 3, image: 'pathogen.png'},
            12: {type: 3, power: 4, winner: 4, image: 'dog.png'},
            13: {type: 3, power: 5, winner: 5, image: 'doctor.png'},
            14: {type: 3, power: 6, winner: 6, image: 'police.png'},
            15: {type: 3, power: 7, winner: 7, image: 'immunity.png'},
        },
    }
};