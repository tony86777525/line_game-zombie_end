const base = require('./BaseController');
const Config = require(base.route.config + 'game');
const GameStateModel = require(base.route.model + 'GameState');
const MessageService = require(base.route.service + 'Message');
const roleService = require(base.route.service + 'Role');
const SceneService = require(base.route.service + 'Scene');
const GameRoundService = require(base.route.service + 'GameRound');

const GameState = new GameStateModel(Config.gameStatesId);
const Message = new MessageService();
const Scene = new SceneService();
const GameRound = new GameRoundService();

module.exports = {
    newGame: NewGame,
    joinGame: JoinGame,
    SelectNumber: SelectNumber,
    SetRole: SetRole,
    StartGame: StartGame,
    SelectScene: SelectScene,
    resetGame: ResetGame,
    callDB: CallDB,
    callGame: CallGame,
    index: Index,
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

async function SetRole(context, params) {
    const isStateSelectNumber = GameState.isStateSelectNumber(context);

    if (false === isStateSelectNumber) {
        await Message.getErrorContents(context);
        return;
    }

    const roleId = Number(params.role);
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
    let returnMessage = [];

    returnMessage.push(Message.getStartGameContents(context));

    returnMessage.push(_startGameRound(context));

    await returnMessage;
}

async function SelectScene(context, gameRound, sceneId) {
    const isStateStartGame = GameState.isStateStartGame(context);

    if (false === isStateStartGame) {
        await Message.getErrorContents(context);
        return;
    }

    const userId = context.session.user.id;
    const isSetGameRoundScene = GameState.setGameRoundScene(context, gameRound, userId, sceneId);

    if (false === isSetGameRoundScene) {
        await Message.getErrorContents(context);
        return;
    }

    const sceneIds = GameState.getNowScenes(context, gameRound);
    const isGameRoundEnd = GameState.isGameRoundEnd(context, gameRound, sceneIds)

    let returnMessage = [];

    // 人數10人 || 單人
    if (true === isGameRoundEnd) {
    // if (true) {
        const { users } = GameState.getUsers(context);
        const { nowGameRound } = GameState.getGameRound(context);
        const $roleService = new roleService;
        const roleGroups = $roleService.getRoleGroupsTemplate();
        const roleGroupsValue = $roleService.getRoleGroupsValueTemplate();
        const scenes = Scene.getScenesTemplate();
        const { transformGroupUsers, resultContentTag, result }
            = GameRound.getGameRoundResult(users, nowGameRound, roleGroups, roleGroupsValue, scenes);

        const { targets, valueTarget } = $roleService.getChangeRoleGroupsTarget();

        GameState.setUserGroup(context, transformGroupUsers, targets, valueTarget);

        returnMessage = returnMessage.concat(Message.getGameRoundEndContents(context, resultContentTag));

        const winCount = GameState.setGameRoundResult(context, result);
        const resultContentTags = GameRound.getGameResult(winCount, users, roleGroups);

        // game end
        if (resultContentTags.length > 0) {
            GameState.setStateStartGame(context);

            returnMessage.push(Message.getGameEndContents(context, resultContentTags));
        } else {
            const { gameRoundNumber } = GameState.getGameRound(context);
            const newGameRound = gameRoundNumber;

            returnMessage.push(_startGameRound(context, newGameRound));
        }
    }

    await returnMessage;
}

async function ResetGame(context) {

    await Message.getResetGameContents(context);
}

async function Index(context) {}

async function CallDB(context) {
    let result = JSON.stringify(GameState.dumpAll(context));
    console.log(result);
    // await context.replyText(result);
}

async function CallGame(context) {
    const $roleService = new roleService;
    const roles = $roleService.getRolesTemplate();

    let result = GameState.dumpGame(context, roles);
    console.log(result);
    // await context.replyText(result);
}

function _startToSelectNumber(context) {
    GameState.setRobot(context);
    const { users } = GameState.getUsers(context);

    const $roleService = new roleService;
    let roles = $roleService.setUsers(users).getRoles();
    GameState.setRoles(context, roles);
}

function _startGameRound(context, gameRound = 0) {
    const sceneIds = Scene.getSceneIds();

    GameState.setGameRound(context, gameRound);
    GameState.setScenes(context, gameRound, sceneIds);

    const checkRoleUsers = GameState.getCheckRoleUsers(context);
    const newSceneIds = GameState.getNowScenes(context, gameRound);
    const newSceneNames = Scene.getSceneNameByIds(sceneIds)

    return Message.getGameRoundContents(context, gameRound, checkRoleUsers, newSceneIds, newSceneNames);
}
