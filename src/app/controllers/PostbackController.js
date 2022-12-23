const common = require('./CommonController');
const gameConfig = require(common.route.config + 'game');
const messageService = require(common.route.service + 'message');

const tableNameSelectedNumber = 'selected_number';
const db = {
    map: {
        'selected_number': {}
    },
};

module.exports = {
    getSelectNumber: getSelectNumber,
    setSelectedNumber: setSelectedNumber,
    index: index,
};

async function getSelectNumber(context) {
    let $messageService = new messageService;

    return context.replyFlex('123', {
            "type": "carousel",
            "contents": $messageService
                .setImagePath(gameConfig.imagePath)
                .setSelectNumber(gameConfig.selectNumber)
                .setSelectedNumber(db.map[tableNameSelectedNumber])
                .getSelectNumberContents()
        }
    );
}

async function setSelectedNumber(context) {
    // 記錄到列表中
    const userId = context.session.user.id;
    const data = context.event.payload;

    // db.map[tableNameSelectedNumber].push({
    //     sessionId: context.session.id,
    //     value: val,
    // });

    return context.replyText(userId);
}


async function index(context) {
    const { text } = context.event;

    return context.replyText('123');
}
