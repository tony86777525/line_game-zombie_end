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
    WelcomeToJoinGame: WelcomeToJoinGame,
    newGame: NewGame,
    joinGame: JoinGame,
    SelectNumber: SelectNumber,
    SetRole: SetRole,
    StartGame: StartGame,
    SelectScene: SelectScene,
    SelectRoleNumber: SelectRoleNumber,
    ResetGame: ResetGame,
    ResetGameCancel: ResetGameCancel,
    callDB: CallDB,
    callGame: CallGame,
    index: Index,
};

async function WelcomeToJoinGame(context) {
    await Message.getFollowContents(context);
}

async function NewGame(context) {
    GameState.init(context);
    const isChangeState = GameState.setStateJoinGame(context);

    if (false === isChangeState) {
        await _getErrorMessage(context);
        return;
    }

    await Message.getNewGameContents(context, GameState);
}

async function JoinGame(context) {
    const isStateJoinGame = GameState.isStateJoinGame(context);

    if (false === isStateJoinGame) {
        await _getErrorMessage(context);
        return;
    }

    const { userId, displayName } = await context.getUserProfile();

    const isJoinUser = GameState.setUserJoin(context, userId, displayName);

    if (false === isJoinUser) {
        await Message.getJoinGameAlreadyContents(context, displayName);
    } else {
        let returnMessage = [];
        const { userCount } = GameState.getUsers(context);

        returnMessage.push(Message.getJoinGameContents(context, GameState, displayName, userCount));

        // 人數10人 || 單人
        if (true === GameState.isFullUsers(context)) {
            const isChangeState = GameState.setStateSelectNumber(context);

            if (false === isChangeState) {
                await _getErrorMessage(context);
                return;
            }

            _startToSelectNumber(context);
            const { users, userCount, robotCount } = GameState.getUsers(context);
            const roles = GameState.getRoles(context);

            returnMessage.push(Message.getStartToSelectNumberContents(context, GameState, userCount, robotCount));
            returnMessage.push(Message.getSelectNumberContents(context, GameState, roles, users));
        }

        await returnMessage;
    }
}

async function SelectNumber(context) {
    const { users, userCount, robotCount } = GameState.getUsers(context);

    if (users.length === 0) {
        await Message.getNoUserToStartGameContents(context);
        return;
    }

    const isChangeState = GameState.setStateSelectNumber(context);

    if (false === isChangeState) {
        await _getErrorMessage(context);
        return;
    }

    let returnMessage = [];

    _startToSelectNumber(context);

    const roles = GameState.getRoles(context);

    returnMessage.push(Message.getStartToSelectNumberContents(context, GameState, userCount, robotCount));

    returnMessage.push(Message.getSelectNumberContents(context, GameState, roles, users));

    await returnMessage;
}

async function SetRole(context, params) {
    const isStateSelectNumber = GameState.isStateSelectNumber(context);

    if (false === isStateSelectNumber) {
        await _getErrorMessage(context);
        return;
    }

    const roleId = Number(params.role);
    const userId = context.session.user.id;
    const isJoinUser = GameState.isJoinUser(context, userId);

    if (false === isJoinUser) {
        await Message.getNotJoinGameUserSelectNumberContents(context);
        return;
    }

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

            await Message.getSelectNumberContents(context, GameState, roles, users);
        } else {
            const isChangeState = GameState.setStateCheckRole(context);

            if (false === isChangeState) {
                await _getErrorMessage(context);
                return;
            }

            // open liff
            await Message.getCheckRoleContents(context, GameState);
        }
    }
}

async function StartGame(context) {
    const isChangeState = GameState.setStateStartGame(context);

    if (false === isChangeState) {
        await _getErrorMessage(context);
        return;
    }

    let returnMessage = [];

    returnMessage.push(Message.getStartGameContents(context, GameState));

    returnMessage.push(_startGameRound(context));

    await returnMessage;
}

async function SelectScene(context, gameRound, sceneId) {
    const isStateStartGame = GameState.isStateStartGame(context);

    if (false === isStateStartGame) {
        await _getErrorMessage(context);
        return;
    }

    const userId = context.session.user.id;
    const isSetGameRoundScene = GameState.setGameRoundScene(context, gameRound, userId, sceneId);

    if (false === isSetGameRoundScene) {
        await _getErrorMessage(context);
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

        GameState.setTransformUser(context, gameRound, transformGroupUsers);
        GameState.setUserGroup(context, transformGroupUsers, targets, valueTarget);

        returnMessage = returnMessage.concat(Message.getGameRoundEndContents(context, GameState, resultContentTag));

        const winCount = GameState.setGameRoundResult(context, result);
        // const winCount = GameState.getGameRoundResult(context);
        const gameResultContentTag = GameRound.getGameResult(winCount, users, roleGroups);

        // game end
        if (undefined !== gameResultContentTag) {
            if (true === gameResultContentTag.type) {
                GameState.setStateEndGame(context);

                returnMessage.push(Message.getGameEndContent(context, GameState, gameResultContentTag));
            } else {
                GameState.setStateFinaleGame(context);

                returnMessage.push(Message.getGameFinaleContent(context, GameState, gameResultContentTag));
            }
        } else {
            const { gameRoundNumber } = GameState.getGameRound(context);
            const newGameRound = gameRoundNumber;

            returnMessage.push(_startGameRound(context, newGameRound));
        }
    }

    await returnMessage;
}

async function SelectRoleNumber(context, selectRoleNumber) {
    const isStateFinaleGame = GameState.isStateFinaleGame(context);

    if (false === isStateFinaleGame) {
        await _getErrorMessage(context);
        return;
    }

    let returnMessage = [];

    const { users } = GameState.getUsers(context);
    const $roleService = new roleService;
    const roleGroups = $roleService.getRoleGroupsTemplate();
    const immunityRoleId = $roleService.getImmunityRole();
    const mapping = users.find(user => user.number === selectRoleNumber && immunityRoleId === user.role_id);

    const winCount = GameState.getGameRoundResult(context);
    returnMessage.push(Message.getSelectRoleNumberResultContent(context, undefined !== mapping));
    const gameResultContentTag = GameRound.getGameResult(winCount, users, roleGroups, undefined !== mapping);

    GameState.setStateEndGame(context);

    returnMessage.push(Message.getGameEndContent(context, GameState, gameResultContentTag));

    await returnMessage;
}

async function ResetGame(context) {
    await Message.getResetGameContents(context);
}

async function ResetGameCancel(context) {
    await Message.getResetGameCancelContents(context);
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

    // const checkRoleUsers = GameState.getCheckRoleUsers(context);
    // const newSceneIds = GameState.getNowScenes(context, gameRound);
    const newSceneNames = Scene.getSceneNameByIds(sceneIds)

    return Message.getGameRoundContents(context, GameState, gameRound, newSceneNames);
}

function _getErrorMessage(context) {
    if (true === GameState.isOverDate(context)) {
        const lastMessageContent = GameState.getLastMessageContent(context);
        console.log(lastMessageContent);
        return Message.getOverDateContents(context, lastMessageContent);
    } else {
        return _getErrorMessage(context);
    }
}