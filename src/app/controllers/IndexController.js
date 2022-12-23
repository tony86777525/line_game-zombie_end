const common = require('./CommonController');
const gameConfig = require(common.route.config + 'game');
const messageService = require(common.route.service + 'message');

const tableNameSelectedNumber = 'selected_number';
const db = {
    map: {},
};

module.exports = {
    getSelectNumber: getSelectNumber,
    setSelectedNumber: setSelectedNumber,
    index: index,
};

async function getSelectNumber(context) {
    let $selectedNumber = db.map[tableNameSelectedNumber];
    let $messageService = new messageService;
    $messageService
        .setImagePath(gameConfig.imagePath)
        .setSelectNumber(gameConfig.selectNumber)
        .setSelectedNumber($selectedNumber)
        .getSelectNumberContents();

    return context.replyFlex('123', {
            "type": "carousel",
            "contents": $messageService
                .setImagePath(gameConfig.imagePath)
                .setSelectNumber(gameConfig.selectNumber)
                .setSelectedNumber($selectedNumber)
                .getSelectNumberContents()
        }
    );
}

async function setSelectedNumber(context) {
    const { find } = require('lodash');
    // db.map = {};
    const userId = context.session.user.id;
    const data = context.event.payload;

    if (!db.map[tableNameSelectedNumber]) db.map[tableNameSelectedNumber] = [];

    const mappings = find(db.map[tableNameSelectedNumber], ['userId', userId]);

    // 如果曾經有任何關於這個關鍵字的紀錄
    if (undefined === mappings) {
        db.map[tableNameSelectedNumber].push({
            number: data,
            userId: userId,
        });
    }

    let $messageService = new messageService;
    let $selectedNumber = db.map[tableNameSelectedNumber];

    return context.replyFlex('123', {
            "type": "carousel",
            "contents": $messageService
                .setImagePath(gameConfig.imagePath)
                .setSelectNumber(gameConfig.selectNumber)
                .setSelectedNumber($selectedNumber)
                .getSelectNumberContents()
        }
    );
}


async function index(context) {
    const { text } = context.event;

    return context.replyText('123');
}
