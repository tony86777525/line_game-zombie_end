const base = require('./BaseController');
const Config = require(base.route.config + 'game');
const GameStateModel = require(base.route.model + 'GameState');
const MessageService = require(base.route.service + 'Message');
const Lang = require(`${base.route.lang}/${process.env.ROOT_LANG}/index`);
const roleService = require(base.route.service + 'Role');
const SceneService = require(base.route.service + 'Scene');

const GameState = new GameStateModel(Config.gameStatesId);
const Message = new MessageService();
const Scene = new SceneService();

module.exports = {
    newGame: NewGame,
    joinGame: JoinGame,
    SelectNumber: SelectNumber,
    SetRole: SetRole,
    StartGame: StartGame,
    SelectScene: SelectScene,
    // resetGame: resetGame,
    callDB: CallDB,
    // index: index,
};

async function NewGame(context) {
    GameState.init(context);
    const isChangeState = GameState.setStateJoinGame(context);

    if (false === isChangeState) {
        await Message.getErrorContents(context);
        return;
    }

    await Message.getNewGameContents(context);
}

async function JoinGame(context) {
    const isStateJoinGame = GameState.isStateJoinGame(context);

    if (false === isStateJoinGame) {
        await Message.getErrorContents(context);
        return;
    }

    const { userId, displayName } = await context.getUserProfile();

    const isJoinUser = GameState.setUserJoin(context, userId, displayName);

    if (false === isJoinUser) {
        await Message.getJoinGameAlreadyContents(context, displayName);
    } else {
        let returnMessage = [];
        const { userCount } = GameState.getUsers(context);

        returnMessage.push(Message.getJoinGameContents(context, displayName, userCount));

        // 人數10人 || 單人
        if (true === GameState.isFullUsers(context)) {
            const isChangeState = GameState.setStateSelectNumber(context);

            if (false === isChangeState) {
                await Message.getErrorContents(context);
                return;
            }

            _startToSelectNumber(context);
            const { users, userCount, robotCount } = GameState.getUsers(context);
            const roles = GameState.getRoles(context);

            returnMessage.push(Message.getStartToSelectNumberContents(context, userCount, robotCount));
            returnMessage.push(Message.getSelectNumberContents(context, roles, users));
        }

        await returnMessage;
    }
}

async function SelectNumber(context) {
    const isChangeState = GameState.setStateSelectNumber(context);

    if (false === isChangeState) {
        await Message.getErrorContents(context);
        return;
    }

    let returnMessage = [];

    _startToSelectNumber(context);
    const { users, userCount, robotCount } = GameState.getUsers(context);
    const roles = GameState.getRoles(context);

    returnMessage.push(Message.getStartToSelectNumberContents(context, userCount, robotCount));

    returnMessage.push(Message.getSelectNumberContents(context, roles, users));

    await returnMessage;
}

async function SetRole(context) {
    const isChangeState = GameState.isStateSelectNumber(context);

    if (false === isChangeState) {
        await Message.getErrorContents(context);
        return;
    }

    const $data = context.event.payload;
    let [, roleId] = $data.split('=');
    roleId = Number(roleId);
    const userId = context.session.user.id;
    const $roleService = new roleService;
    const rolesTemplate = $roleService.getRolesTemplate();
    const isSetRoleToUser = GameState.setRoleToUser(context, userId, roleId, rolesTemplate);

    if (false === isSetRoleToUser) {
        await Message.getSelectNumberAlreadyContents(context);
    } else {
        const isStartToCheckRole = GameState.isStartToCheckRole(context, rolesTemplate);

        if (false === isStartToCheckRole) {
            const { users } = GameState.getUsers(context);
            const roles = GameState.getRoles(context);

            await Message.getSelectNumberContents(context, roles, users);
        } else {
            const isChangeState = GameState.setStateCheckRole(context);

            if (false === isChangeState) {
                await Message.getErrorContents(context);
                return;
            }

            const checkRoleUsers = GameState.getCheckRoleUsers(context);

            // open liff
            await Message.getCheckRoleContents(context, checkRoleUsers);
        }
    }
}

async function StartGame(context) {
    const isChangeState = GameState.setStateStartGame(context);

    if (false === isChangeState) {
        await Message.getErrorContents(context);
        return;
    }

    const sceneIds = Scene.getSceneIds();

    GameState.setScenes(context, sceneIds);

    const checkRoleUsers = GameState.getCheckRoleUsers(context);
    const newSceneIds = GameState.getNowScenes(context);

    await Message.getStartGameContents(context, checkRoleUsers, newSceneIds);
}

async function SelectScene() {
    // const isChangeState = GameState.setStateStartGame(context);
    //
    // if (false === isChangeState) {
    //     await Message.getErrorContents(context);
    //     return;
    // }
console.log('SelectScene');
    // await Message.getStartGameContents(context, checkRoleUsers, newSceneIds);
}

async function CallDB(context) {
    let result = JSON.stringify(GameState.dumpAll(context));
    console.log(result);
    await context.replyText(result);
}

// async function getCheckRole(context) {
//     const { getClient } = require('bottender');
//
//     // get group number
//     if (undefined !== context.session.group) {
//         $targetId = context.session.group.id;
//         console.log(getClient.getAllGroupMemberIds($targetId).length);
//     }
//
//     // console.log($users);
// }
//
// async function resetGame(context) {
//     _resetGame(context);
//
//     return context.replyText('Game Reset OK!!');
// }
//

//
// async function index(context) {
//     const { text } = context.event;
//
//     return context.replyText('123');
// }
//
// function _resetGame(context) {
//     let $getSelectedNumbersTarget = db.map[tableNameSelectedNumber].groups;
//     let $targetId;
//
//     if (undefined !== context.session.group) {
//         // group message
//         $targetId = context.session.group.id;
//     } else if (undefined !== context.session.user) {
//         // user message
//         $targetId = context.session.user.id;
//     }
//
//     delete $getSelectedNumbersTarget[$targetId];
// }
//
function _startToSelectNumber(context) {
    GameState.setRobot(context);
    const { users } = GameState.getUsers(context);

    const $roleService = new roleService;
    let roles = $roleService.setUsers(users).getRoles();
    GameState.setRoles(context, roles);
}

//
// function _getContextData(context) {
//     let $getSelectedNumbersTarget = db.map[tableNameSelectedNumber].groups;
//     let $targetId;
//
//     if (undefined !== context.session.group) {
//         // group message
//         $targetId = context.session.group.id;
//     } else if (undefined !== context.session.user) {
//         // user message
//         $targetId = context.session.user.id;
//     }
//
//     // new group
//     if (undefined === $getSelectedNumbersTarget[$targetId])
//         $getSelectedNumbersTarget[$targetId] = {id: $targetId, step: gameConfig.step.select_number, users: []};
//
//     return $getSelectedNumbersTarget[$targetId].users;
// }
