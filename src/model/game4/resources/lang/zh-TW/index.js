module.exports = {
    newGame: "歡迎來到《末日危機》的桌遊世界\n請點擊開始遊戲！",
    joinGame: "加入遊戲",
    startGame: "開始遊戲",

    joinGameAlready: "{name}已加入，請稍待遊戲開始！",
    joinGameState: "{name}  加入遊戲桌！\n目前人數： {userCount}人\n\n其他玩家請加入",
    startToSelectNumber: "共有{userCount}名玩家，{robotCountText}參與遊戲。\n\n請選擇喜歡的數字：\n※已選擇的數字無法二次選擇。",
    startToSelectNumberRobotCount: "由系統操作另外{robotCount}位角色，",

    selectNumber: {
        0: "數字一",
        1: "數字二",
        2: "數字三",
        3: "數字四",
        4: "數字五",
        5: "數字六",
        6: "數字七",
        7: "數字八",
        8: "數字九",
        9: "數字十"
    },
    unSelectNumber: "選擇號碼",
    selectedNumber: "已選擇號碼",

    selectNumberAlready: "已選擇過數字，請稍待遊戲開始！",

    checkRole: "確認角色",

    gameStartStory: "21世紀，一場無妄之災降臨地球，從養老院第一起咬人事件起，人們逐漸察覺到“變異者”的存在。起初，政府試圖隱瞞病毒事件，直到各種爭議四起，矛頭指向了P4生物研究所，很多人認為那裏是變異病毒的始源地，然而也有人認為，那是冰封15000年甚至更久的病毒在經歷了全球變暖後再次重見天日……\n末日降臨，人類秩序被打亂，地球陷入了史無前例的危機之中，越來越多的變異者開始攻擊人類，想要活下去，首先得保證物資的充足。\n“我們需要尋找食物、水，還有更多倖存者，我們需要互相幫助，才能生存下去。”",

    gameRound: "這裏是H州救援隊，我們已經收到了你的求救信號！\n目前地面道路已被變異者攻陷，我們將派出直升機前往救援，預計需要三天時間！\n請不要慌張，我們已經通過衛星訊號為你找到可搜尋物資的躲藏點，\n離你最近的建築有{sceneText}和{sceneText}，\n我們不確定裏面是否有變異者，\n在救援隊趕來之前請保證自身安全，\n祝你平安/好運！\n",

    checkRound: "確認本回合行動",

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
        2: "變異方",
        3: "人類方",
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
        1: "人類方完成３次物資搜索／異變方阻礙３次物資搜索",
        2: "阻礙３次物資搜索",
        3: "尋找並殺死人類方的「免疫者」",
        4: "完成３次物資搜索",
        5: "完成３次物資搜索",
        6: "保護免疫者不被殺害",
        7: "不被宿主殺死並完成３次物資搜索",
    },

    scenes: {
        name: {
            1: "住家",
            2: "藥房",
            3: "教堂",
            4: "旅館",
            5: "警局",
            6: "商辦",
        },
        content: {
            1: "搜索人數2人",
            2: "搜索人數2人",
            3: "搜索人數3人",
            4: "搜索人數3人",
            5: "搜索人數4人",
            6: "搜索人數5人",
        }
    },
};