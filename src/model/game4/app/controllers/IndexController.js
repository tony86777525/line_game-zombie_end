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
    const round = 1;

    await Message.getStartGameContents(context, round, checkRoleUsers, newSceneIds);
}

async function SelectScene(context, round, sceneId) {
    // const isChangeState = GameState.setStateStartGame(context);
    //
    // if (false === isChangeState) {
    //     await Message.getErrorContents(context);
    //     return;
    // }
    console.log(round);
    console.log(sceneId);
    const userId = context.session.user.id;
    GameState.setRoundUserScene(context, round, userId, sceneId)
console.log('SelectScene');

    // const sceneIds = Scene.getSceneIds();
    //
    // GameState.setScenes(context, sceneIds);
    //
    // const checkRoleUsers = GameState.getCheckRoleUsers(context);
    // const newSceneIds = GameState.getNowScenes(context);
    // const round = 1;
    //
    // await Message.getStartGameContents(context, round, checkRoleUsers, newSceneIds);
    // await Message.getStartGameContents(context, checkRoleUsers, newSceneIds);
}

async function CallDB(context) {
    let result = JSON.stringify(GameState.dumpAll(context));
    console.log(result);
    await context.replyText(result);
}

function _startToSelectNumber(context) {
    GameState.setRobot(context);
    const { users } = GameState.getUsers(context);

    const $roleService = new roleService;
    let roles = $roleService.setUsers(users).getRoles();
    GameState.setRoles(context, roles);
}
