module.exports = {
    selectNumber: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],

    imagePath: 'https://db2a-218-35-166-9.ngrok.io/',

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
    }
};