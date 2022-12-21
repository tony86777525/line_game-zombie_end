const { sendText, random } = require('bottender-compose');
const imagePath = 'https://fdb1-218-35-166-9.ngrok.io/';

let result = {
    type: 'bubble',
    // hero: {
    //     type: 'image',
    //     url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
    //     size: 'full',
    //     aspectRatio: '20:13',
    // },
    body: {
        type: 'box',
        // horizontal / vertical
        layout: 'horizontal',
        contents: [
            {
                type: 'text',
                text: 'Brown Cafe',
                weight: 'bold',
                size: 'xl',
            },
            {
                type: 'text',
                text: 'World!',
            },
        ],
    },

    footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'button',
                action: {
                    type: 'uri',
                    label: 'WEBSITE',
                    uri: 'https://linecorp.com',
                },
            },
        ],
    },
};

async function randomMessageResponse() {
    return random([
        '加油站最怕什麼樣的員工？油腔滑調的員工',
        '有一天，西瓜、榴槤、奇異果一起出去玩，結果榴槤不見了。因為榴槤忘返',
        '海記憶體知己，天涯若比鄰',
    ]);
}

async function flexMessageResponse(context) {
    let number = {
        '1' : '一',
        '2' : '二',
        '3' : '三',
        '4' : '四',
        '5' : '五',
        '6' : '六',
        '7' : '七',
        '8' : '八',
        '9' : '九',
    };
    let contents = [];

    for (let i = 1; i <= 9; i++) {
        const content = {
            "type": "bubble",
            "direction": "ltr",
            "header": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "text",
                        "text": "數字" + number[i],
                        "weight": "bold",
                        "size": "xxl",
                        "align": "center",
                        "gravity": "center",
                        "contents": []
                    }
                ]
            },
            "hero": {
                "type": "image",
                "url": imagePath + 'src/public/assets/img/game/numbers/' + i + '.jpg',
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "fit",
            },
            "footer": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "button",
                        "action": {
                            "type": "postback",
                            "label": "選擇號碼",
                            "data": i
                        }
                    }
                ]
            }
        };

        contents.push(content);
    }

    return context.replyFlex('123', {
        "type": "carousel",
        "contents": contents
    });
}

module.exports = {
    messenger: {
        randomMessageResponse,
        flexMessageResponse
    },
};