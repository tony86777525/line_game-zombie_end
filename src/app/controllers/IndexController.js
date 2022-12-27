const common = require('./CommonController');
const gameConfig = require(common.route.config + 'game');
const messageService = require(common.route.service + 'message');
const roleService = require(common.route.service + 'role');
const {find, findKey} = require("lodash");

const tableNameSelectedNumber = 'selected_number';
const db = {
    map: {
        selected_number: {
            groups: [],
        },
    },
};

module.exports = {
    newGame: newGame,
    joinGame: joinGame,
    startGame: startGame,
    setRole: setRole,
    resetGame: resetGame,
    callDB: callDB,
    index: index,
};

async function newGame(context) {
    _resetGame(context);
    const $messageService = new messageService;

    return context.replyFlex('123', {
            "type": "carousel",
            "contents": $messageService
                .getNewGameContents('歡迎來到《末日危機》的桌遊世界\n請點擊開始遊戲！')
        }
    );
}

async function joinGame(context) {
    const { userId, displayName } = await context.getUserProfile();
    let $getSelectedNumbersTarget = db.map[tableNameSelectedNumber].groups;
    let $targetId;

    if (undefined !== context.session.group) {
        // group message
        $targetId = context.session.group.id;
    } else if (undefined !== context.session.user) {
        // user message
        $targetId = context.session.user.id;
    }

    // new group
    if (undefined === $getSelectedNumbersTarget[$targetId])
        $getSelectedNumbersTarget[$targetId] = {id: $targetId, step: gameConfig.step.join_game, users: [], roles: []};

    let $users = $getSelectedNumbersTarget[$targetId].users;
    let $mappings = find($users, ['id', userId]);

    if (undefined !== $mappings)return context.replyText(`${displayName}已加入，請稍待遊戲開始！`);
    else {
        $users.push({
            id: userId,
            type: gameConfig.user.type.user,
            role_id: ''
        });
    }

    const $messageService = new messageService;
    let $returnMessage = [];

    // send join game message
    $returnMessage.push(
        context.replyFlex('123', {
                "type": "carousel",
                "contents": $messageService
                    .getNewGameContents(`${displayName}  加入遊戲桌！\n目前人數： ${$users.length}人\n\n其他玩家請加入`)
            }
        )
    );

    // 人數10人 || 單人
    if (gameConfig.user.max_count === $users.length || undefined === context.session.group) {
        $returnMessage = $returnMessage.concat(_startGame(context));
    }

    return $returnMessage;
}

async function startGame(context) {
    return _startGame(context);
}

async function setRole(context) {
    const $data = context.event.payload;
    const [, $roleId] = $data.split('=');
    const $userId = context.session.user.id;
    let $messageService = new messageService;
    let $getGroup = db.map[tableNameSelectedNumber].groups;
    let $targetId;

    if (undefined !== context.session.group) {
        // group message
        $targetId = context.session.group.id;
    } else if (undefined !== context.session.user) {
        // user message
        $targetId = context.session.user.id;
    }

    let $users = $getGroup[$targetId].users;

    let $mappings = find($users, ($user) => {
        if (($user.id === $userId && $user.role_id !== '') || $user.role_id === $roleId) {
            return true;
        }
    });

    // 如果曾經有任何關於這個關鍵字的紀錄
    if (undefined !== $mappings) return context.replyText('已選擇過數字，請稍待遊戲開始！');
    else {
        const $userKey = findKey($users, ['id', $userId]);
        $users[$userKey].role_id = $roleId;

        // start game
        if ($users.filter($user => $user.type === gameConfig.user.type.user && $user.role !== '').length > 0) {
            return context.replyFlex('123', {
                    "type": "carousel",
                    "contents": $messageService.getRoleLiffContents()
                }
            );
        } else {
            let $roles = $getGroup[$targetId].roles;
            return context.replyFlex('123', {
                    "type": "carousel",
                    "contents": $messageService
                        .setSelectNumber(Object.keys(gameConfig.selectNumber)
                            .filter(number => number <= $users.length)
                            .reduce((obj, key) => {
                                obj[key] = gameConfig.selectNumber[key];
                                return obj;
                            }, {}))
                        .setRoles($roles)
                        .getJoinGameContents()
                }
            );
        }
    }
}

async function getCheckRole(context) {
    const { getClient } = require('bottender');

    // get group number
    if (undefined !== context.session.group) {
        $targetId = context.session.group.id;
        console.log(getClient.getAllGroupMemberIds($targetId).length);
    }

    // console.log($users);
}

async function resetGame(context) {
    _resetGame(context);

    return context.replyText('Game Reset OK!!');
}

async function callDB(context) {
    let $targetId;
    if (undefined !== context.session.group) {
        // group message
        $targetId = context.session.group.id;
    } else if (undefined !== context.session.user) {
        // user message
        $targetId = context.session.user.id;
    }
    console.log(db.map.selected_number.groups[$targetId].users);

    return context.replyText('Call DB OK');
}

async function index(context) {
    const { text } = context.event;

    return context.replyText('123');
}

function _resetGame(context) {
    let $getSelectedNumbersTarget = db.map[tableNameSelectedNumber].groups;
    let $targetId;

    if (undefined !== context.session.group) {
        // group message
        $targetId = context.session.group.id;
    } else if (undefined !== context.session.user) {
        // user message
        $targetId = context.session.user.id;
    }

    delete $getSelectedNumbersTarget[$targetId];
}

function _startGame(context) {
    let returnMessage = [];
    let $getSelectedNumbersTarget = db.map[tableNameSelectedNumber].groups;
    let $targetId;
    if (undefined !== context.session.group) {
        // group message
        $targetId = context.session.group.id;
    } else if (undefined !== context.session.user) {
        // user message
        $targetId = context.session.user.id;
    }
    $getSelectedNumbersTarget[$targetId].step = gameConfig.step.select_number;

    let $users = _getContextData(context);

    const $messageService = new messageService;
    // set robot
    let $i = 0;
    while(gameConfig.user.min_count > $users.length) {
        $i++;
        let $name = `robot${$i}`;
        $users.push({
            id: $name,
            type: gameConfig.user.type.robot,
            role_id: ''
        });
    }

    // set roles
    const $roleService = new roleService;
    let $roles = $roleService.setUsers($users).getRoles();
    $getSelectedNumbersTarget[$targetId].roles = $roles;

    // send select number message
    let $usersCount = $users.filter($user => $user.type === gameConfig.user.type.user).length;
    let $robotCount = $users.filter($user => $user.type === gameConfig.user.type.robot).length;

    returnMessage.push(
        context.replyText(
            `共有${$usersCount}名玩家，`
            + ($robotCount > 0 ? `由系統操作另外${$robotCount}位角色，` : '')
                + `參與遊戲。\n\n請選擇喜歡的數字：\n※已選擇的數字無法二次選擇。`
        )
    );

    returnMessage.push(
        context.replyFlex('123', {
            "type": "carousel",
            "contents": $messageService
                .setSelectNumber(Object.keys(gameConfig.selectNumber)
                    .filter(number => number <= $users.length)
                    .reduce((obj, key) => {
                        obj[key] = gameConfig.selectNumber[key];
                        return obj;
                    }, {}))
                .setRoles($roles)
                .getJoinGameContents()
        })
    );

    return returnMessage;
}

function _getContextData(context) {
    let $getSelectedNumbersTarget = db.map[tableNameSelectedNumber].groups;
    let $targetId;

    if (undefined !== context.session.group) {
        // group message
        $targetId = context.session.group.id;
    } else if (undefined !== context.session.user) {
        // user message
        $targetId = context.session.user.id;
    }

    // new group
    if (undefined === $getSelectedNumbersTarget[$targetId])
        $getSelectedNumbersTarget[$targetId] = {id: $targetId, step: gameConfig.step.select_number, users: []};

    return $getSelectedNumbersTarget[$targetId].users;
}
