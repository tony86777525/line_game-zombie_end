module.exports = {
    newGame: "歡迎來到《末日危機》的桌遊世界\n請點擊開始遊戲！",
    joinGame: "加入遊戲",
    startGame: "開始遊戲",
    yes: "是",
    no: "否",

    joinGameAlready: "{name}已加入，請稍待遊戲開始！",
    joinGameState: "{name}  加入遊戲桌！\n目前人數： {userCount}人\n\n其他玩家請加入",
    startToSelectNumber: "共有{userCount}名玩家，{robotCountText}參與遊戲。\n\n請選擇喜歡的數字：\n※已選擇的數字無法二次選擇。",
    startToSelectNumberRobotCount: "由系統操作另外{robotCount}位角色，",

    selectNumberTitle: "數字",
    number: {
        0: "一",
        1: "二",
        2: "三",
        3: "四",
        4: "五",
        5: "六",
        6: "七",
        7: "八",
        8: "九",
        9: "十"
    },
    unSelectNumber: "選擇號碼",
    selectedNumber: "已選擇號碼",

    selectNumberAlready: "已選擇過數字，請稍待遊戲開始！",

    checkRole: "確認角色",

    gameStartStory: "21世紀，一場無妄之災降臨地球，從養老院第一起咬人事件起，人們逐漸察覺到“變異者”的存在。起初，政府試圖隱瞞病毒事件，直到各種爭議四起，矛頭指向了P4生物研究所，很多人認為那裏是變異病毒的始源地，然而也有人認為，那是冰封15000年甚至更久的病毒在經歷了全球變暖後再次重見天日……\n末日降臨，人類秩序被打亂，地球陷入了史無前例的危機之中，越來越多的變異者開始攻擊人類，想要活下去，首先得保證物資的充足。\n“我們需要尋找食物、水，還有更多倖存者，我們需要互相幫助，才能生存下去。”",

    gameRound: "這裏是H州救援隊，我們已經收到了你的求救信號！\n目前地面道路已被變異者攻陷，我們將派出直升機前往救援，預計需要三天時間！\n請不要慌張，我們已經通過衛星訊號為你找到可搜尋物資的躲藏點，\n離你最近的建築有{sceneText}和{sceneText}，\n我們不確定裏面是否有變異者，\n在救援隊趕來之前請保證自身安全，\n祝你平安/好運！\n",

    checkRound: "確認本回合行動",

    votingRound: "確認本回合探索分配",

    votingRoundAlready: "請稍待其他玩家！",
    votingRoundNotAgree: "本回合探索分配部分玩家不通過，請重新選擇！",
    votingRoundAllNotAgree: "本回合探索分配全部玩家不通過，請重新選擇！",

    gameRoundEnd: "您好！\n收到本次的任務回報，\n{userNumberText}前去{sceneText}搜索，\n{resultText}",
    gameRoundEndAnd: "、",
    gameRoundEndNumber: "號",
    gameRoundEndResult: {
        1: "那裡出乎意料的安全，找到了不少物資。\n幹得還不錯啊！",
        2: "那裡有少量的喪屍，但不影響搜索物資。\n幹得還不錯啊！",
        3: "那裡有不少喪屍，所有物資都被破壞了。",
        4: "那裡聚集了許多喪屍，大家只顧著逃命。",
        5: "那裡什麼也沒有，沒有物資、沒有喪屍。",
        6: "沒有人尋找物資。",
    },

    gameFinale: "遊戲終盤\n目前由{resultText}獲勝\n\n宿主玩家請選擇免疫者。",
    gameFinaleButton: "請宿主選擇免疫者",

    selectRoleNumberRight: "宿主猜對免疫者！",
    selectRoleNumberWrong: "宿主猜錯免疫者！",
    gameEnd: "遊戲結束！\n由{resultText}獲勝\n\n本輪遊戲已結束是否要開啟新局？",
    gameEndAnd: "、",
    gameEndNumber: "號",
    gameEndResult: {
        1: "人類方：",
        2: "異變方：",
    },

    resetGame: "確定要重新開始遊戲嗎?",
    resetGameCancel: "感謝您的遊玩，歡迎隨時輸入“START”再次啟動遊戲。",

    noUserToStartGame: "目前沒有玩家加入遊戲，請先加入遊戲。",
    notJoinGameUserSelectNumber: "你目前不是玩家，請不要選擇號碼。",
    overDate: "大家都在等你喔！！請選擇",
    error: "[error]啊，你點慢了一步。",

    roleCard: {
        1: "梅森",
        2: "傑克",
        3: "本",
        4: "漢娜",
        5: "黛西",
        6: "海柔爾",
        7: "赫達",
        8: "帕特裏克",
        9: "西蒙森",
        10: "埃阿斯",
        11: "宿主",
        12: "警犬",
        13: "醫生",
        14: "警察",
        15: "免疫者",
    },
    roleType: {
        1: "中立方",
        2: "異變方",
        3: "人類方",
        4: "宿主",
    },
    rolePower: {
        1: "初始皆與「人類方」立場相同，但搜索物資若是異變人數＞人類人數時，會被病毒感染轉變成「異變方」",
        2: "搜索物資時，若是異變人數比人類多，則將人類轉變成「異變方」",
        3: "搜索物資時，若是異變人數比人類多，則將人類轉變成「異變方」",
        4: "能分辨異變方與人類方，但無法說話",
        5: "能得知是否有人類被感染",
        6: "知道誰是「免疫者」",
        7: "不會被感染成為「異變方」",
    },
    roleWinner: {
        1: "人類方完成５次物資搜索且免疫者未被宿主殺死／異變方阻礙５次物資搜索",
        2: "阻礙５次物資搜索",
        3: "尋找並殺死人類方的「免疫者」",
        4: "完成５次物資搜索且免疫者未被宿主殺死",
        5: "完成５次物資搜索且免疫者未被宿主殺死",
        6: "完成５次物資搜索且保護免疫者不被殺害",
        7: "不被宿主殺死並完成５次物資搜索",
    },

    scenes: {
        name: {
            0: "留守",
            1: "住家",
            2: "藥房",
            3: "教堂",
            4: "旅館",
            5: "警局",
            6: "商辦",
            7: "購物中心",
        },
        content: {
            0: "",
            1: "上限二人",
            2: "上限二人",
            3: "上限三人",
            4: "上限三人",
            5: "上限四人",
            6: "上限五人",
            7: "上限五人",
        }
    },

    liff: {
        role: {
            name: "陣營身分：",
            power: "角色能力：",
            winner: "獲勝方式：",
            doctorMessage: "醫生的通報：本次搜索導致{userCount}名人類遭受感染。"
        },

        voting: {
            title: "本次探索分配：",
            contentScene: "有{userCount}名前往{sceneText}探索。",
            contentStay: "有{userCount}名{sceneText}。",
        },
    }
};