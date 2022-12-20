const { sendText, random } = require('bottender-compose');

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

async function setA() {
    return this;
}

async function flexMessageResponse(context) {
    return context.replyFlex('123', {
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
    });
}

module.exports = {
    messenger: {
        randomMessageResponse,
        flexMessageResponse
    },
};