module.exports = async function App(context) {
    await context.sendText('Welcome to Bottender');
};

const db = {
    map: {},
};

module.exports = async function App(context) {
    const { router, text } = require('bottender/router');

    return router([
        text(/^卡米狗學說話;([^;]+);([^;]+)$/, 卡米狗學說話),
        text(/^卡米狗忘記;([^;]+)$/, 卡米狗忘記),
        text('*', 卡米狗試著回話),
    ]);
};

async function 卡米狗學說話(context) {
    // 學說話指令的程式碼
    // 斷開後第一個部分是「卡米狗學說話」，可以直接忽略它
    const { text } = context.event;
    const [, key, val] = text.split(';');

    // 如果沒有教過就初始化
    if (!db.map[key]) db.map[key] = [];

    // 記錄到列表中
    db.map[key].push({
        sessionId: context.session.id,
        keyword: key,
        message: val,
    });

    // 這整段程式碼會放到 async function 中，所以可以等待這個 promise
    await context.sendText('好哦~好哦~*1');
    return;
}

async function 卡米狗忘記(context) {
    // 忘記指令的程式碼
    // 斷開後第一個部分是「卡米狗忘記」，可以直接忽略它
    const { text } = context.event;
    const [, key] = text.split(';');

    // 只過濾掉這個 session 所定義的
    db.map[key] = db.map[key].filter(
        mapping => mapping.sessionId !== context.session.id
    );

    await context.sendText('好哦~好哦~*1');
    return;
}

async function 卡米狗試著回話(context) {
    const { partition, last } = require('lodash');
    // 回話的程式碼
    const { text } = context.event;
    const mappings = db.map[text];
    // 如果曾經有任何關於這個關鍵字的紀錄
    if (mappings && mappings.length > 0) {
        // 以 sessionId 匹配與否切分成兩個陣列
        const [localMappings, globalMappings] = partition(mappings, {
            sessionId: context.session.id
        });

        // 先取 local 裡設定的最後一個，取不到才用 global 的
        const answer = last(
            localMappings.length > 0 ? localMappings: globalMappings
        ).message;

        await context.sendText(answer);
        return;
    }
}