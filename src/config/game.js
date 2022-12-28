module.exports = {
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
            1: {name: '', type: 1, power: 1, winner: 1, image: 'people1.png'},
            2: {name: '', type: 1, power: 1, winner: 1, image: 'people2.png'},
            3: {name: '', type: 1, power: 1, winner: 1, image: 'people3.png'},
            4: {name: '', type: 1, power: 1, winner: 1, image: 'people4.png'},
            5: {name: '', type: 1, power: 1, winner: 1, image: 'people5.png'},
            6: {name: '', type: 1, power: 1, winner: 1, image: 'people6.png'},
            7: {name: '', type: 2, power: 2, winner: 2, image: 'infected1.png'},
            8: {name: '', type: 2, power: 2, winner: 2, image: 'infected2.png'},
            9: {name: '', type: 2, power: 2, winner: 2, image: 'infected3.png'},
            10: {name: '', type: 2, power: 2, winner: 2, image: 'infected4.png'},
            11: {name: '宿主', type: 2, power: 3, winner: 3, image: 'pathogen.png'},
            12: {name: '警犬', type: 3, power: 4, winner: 4, image: 'dog.png'},
            13: {name: '醫生', type: 3, power: 5, winner: 5, image: 'doctor.png'},
            14: {name: '警察', type: 3, power: 6, winner: 6, image: 'police.png'},
            15: {name: '免疫者', type: 3, power: 7, winner: 7, image: 'immunity.png'},
        },
        type: {
            1: {name: '中立方'},
            2: {name: '變異方'},
            3: {name: '人類方'},
        },
        power: {
            1: {name: '初始皆與「人類方」立場相同，但搜索物資若是異變人數＞人類人數時，會被病毒感染轉變成「異變方」'},
            2: {name: '搜索物資時，若是異變人數比人類多，則將人類轉變成「異變方」'},
            3: {name: '搜索物資時，若是異變人數比人類多，則將人類轉變成「異變方」'},
            4: {name: '能分辨異變方與人類方，但無法說話'},
            5: {name: '能得知是否有人類被感染'},
            6: {name: '知道誰是「免疫者」'},
            7: {name: '不會被感染成為「異變方」'},
        },
        winner: {
            1: {name: '人類方完成３次物資搜索／異變方阻礙３次物資搜索'},
            2: {name: '阻礙３次物資搜索'},
            3: {name: '尋找並殺死人類方的「免疫者」'},
            4: {name: '完成３次物資搜索'},
            5: {name: '完成３次物資搜索'},
            6: {name: '保護免疫者不被殺害'},
            7: {name: '不被宿主殺死並完成３次物資搜索'},
        }
    }
};