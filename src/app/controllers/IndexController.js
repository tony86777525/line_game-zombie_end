const common = require('./CommonController');
const gameConfig = require(common.route.config + 'game');
const messageService = require(common.route.service + 'message');
const {find} = require("lodash");

const tableNameSelectedNumber = 'selected_number';
const db = {
    map: {
        selected_number: {
            users: [],
            groups: [],
        },
    },
};

module.exports = {
    getSelectNumber: getSelectNumber,
    setSelectedNumber: setSelectedNumber,
    resetGame: resetGame,
    callDB: callDB,
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

    let $searchKey, $searchValue, $userId, $groupId, $getSelectedNumbers;
    const $data = context.event.payload;
    $userId = context.session.user.id;

    // group message
    if (undefined !== context.session.group) {
        $searchKey = 'groups';
        $groupId = context.session.group.id;
        $getSelectedNumbersTarget = db.map[tableNameSelectedNumber][$searchKey];

        let $mappings = find($getSelectedNumbersTarget, ['id', $groupId]);

        // new group
        if (undefined === $mappings) $getSelectedNumbersTarget[$groupId] = [];

        $getSelectedNumbers = $getSelectedNumbersTarget[$groupId];
    } else if (undefined !== context.session.user) {
        // user message
        $searchKey = 'users';
        $getSelectedNumbers = db.map[tableNameSelectedNumber][$searchKey];
    }


    let $mappings = find($getSelectedNumbers, ['id', $userId]);

    // 如果曾經有任何關於這個關鍵字的紀錄
    if (undefined !== $mappings) return context.replyText('已選擇過數字，請稍待遊戲開始！');

    if (undefined === $mappings) {
// console.log($getSelectedNumbers);
        $getSelectedNumbers.push({
            id: $userId,
            number: $data,
        });
        // console.log($getSelectedNumbers);

        let $messageService = new messageService;

        return context.replyFlex('123', {
                "type": "carousel",
                "contents": $messageService
                .setImagePath(gameConfig.imagePath)
                .setSelectNumber(gameConfig.selectNumber)
                .setSelectedNumber($getSelectedNumbers)
                .getSelectNumberContents()
            }
        );
    }
}

async function resetGame(context) {
    db.map = {};

    return context.replyText('Game Reset OK!!');
}

async function callDB(context) {
    console.log(db.map.selected_number.users);
    console.log(db.map.selected_number.groups);

    return context.replyText('Call DB OK');
}

async function index(context) {
    const { text } = context.event;

    return context.replyText('123');
}
