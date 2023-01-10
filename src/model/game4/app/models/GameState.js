class GameState
{
    constructor(gameStatesId) {
        this.gameStatesId = gameStatesId;

        this.state = {
            newGame: 0,
            joinGame: 1,
            selectNumber: 2,
            checkRole: 3,
            startGame: 4,
            endGame: 5,
        };

        this.user = {
            min_count: 5,
            max_count: 10,
            type: {
                user: 1,
                robot: 0
            },
        };
    }

    init(context) {
        context.state.gameStates[this.gameStatesId] = {
            state: this.state.newGame,
            users: [],
            roles: [],
            scenes: [],
            gameRounds: [],
            gameRoundResult: {
                immunity: 0,
                people: 0,
            },
        };

        return this;
    }

    setStateJoinGame(context) {
        let result = false;

        if (true === this._isChangeState(context, this.state.joinGame)) {
            context.state.gameStates[this.gameStatesId].state = this.state.joinGame;
            result = true;
        }

        return result;
    }

    isStateJoinGame(context) {
        return this.state.joinGame === context.state.gameStates[this.gameStatesId].state;
    }

    setUserJoin(context, userId, userName) {
        let result = false;

        const { find } = require("lodash");
        const users = context.state.gameStates[this.gameStatesId].users;

        if (undefined === find(users, ['id', userId])) {
            context.state.gameStates[this.gameStatesId].users.push({
                id: userId,
                name: userName,
                type: this.user.type.user,
                number: '',
                role_id: '',
                group: ''
            });

            result = true;
        }

        return result;
    }

    isFullUsers(context) {
        let result = false;

        const users = context.state.gameStates[this.gameStatesId].users;

        if (this.user.max_count === users.length
            || (undefined === context.session.group && 1 <= users.length))
        {
            result = true;
        }

        return result;
    }

    setRobot(context) {
        const users = context.state.gameStates[this.gameStatesId].users;
        let i = 0;

        while(this.user.min_count > users.length) {
            i++;
            let name = `robot${i}`;
            context.state.gameStates[this.gameStatesId].users.push({
                id: name,
                name: name,
                type: this.user.type.robot,
                number: '',
                role_id: '',
                group: ''
            });
        }
    }

    getUsers(context) {
        const users = context.state.gameStates[this.gameStatesId].users;

        return {
            users: users,
            userCount: users.filter($user => $user.type === this.user.type.user).length,
            robotCount: users.filter($user => $user.type === this.user.type.robot).length,
        };
    }

    setRoles(context, roles) {
        context.state.gameStates[this.gameStatesId].roles = roles;
    }

    getRoles(context) {
        return context.state.gameStates[this.gameStatesId].roles;
    }

    setStateSelectNumber(context) {
        let result = false;

        if (true === this._isChangeState(context, this.state.selectNumber)) {
            context.state.gameStates[this.gameStatesId].state = this.state.selectNumber;

            result = true;
        }

        return result;
    }

    isStateSelectNumber(context) {
        return this.state.selectNumber === context.state.gameStates[this.gameStatesId].state;
    }

    isStateStartGame(context) {
        return this.state.startGame === context.state.gameStates[this.gameStatesId].state;
    }

    isStateSelectSceneRound(context, round) {
        return this.state.startGame === context.state.gameStates[this.gameStatesId].state;
    }

    setStateStartGame(context) {
        let result = false;

        if (true === this._isChangeState(context, this.state.startGame)) {
            context.state.gameStates[this.gameStatesId].state = this.state.startGame;

            result = true;
        }

        return result;
    }

    setRoleToUser(context, userId, roleId, rolesTemplate) {
        const { find, findKey } = require("lodash");
        let result = false;

        const users = context.state.gameStates[this.gameStatesId].users;
        const roles = context.state.gameStates[this.gameStatesId].roles;

        const mappings = find(users, (user) => {
            return (user.id === userId && user.role_id !== '') || user.role_id === roleId;
        });

        if (undefined === mappings) {
            const userKey = findKey(users, {id: userId});
            const roleTemplate = rolesTemplate[roleId];
            users[userKey].role_id = roleId;
            users[userKey].number = Number(Object.keys(roles).find(key => roles[key] == roleId)),
            users[userKey].group = roleTemplate.group;

            result = true;
        }

        return result;
    }

    isStartToCheckRole(context, rolesTemplate) {
        const { find } = require("lodash");
        let result = false;

        const users = context.state.gameStates[this.gameStatesId].users;
        const roles = context.state.gameStates[this.gameStatesId].roles;
        const mappings = find(users, user => user.type === this.user.type.user && user.role_id === "");

        if (undefined === mappings) {
        // if (users.filter(user => user.type === this.user.type.user && user.role !== '').length > 0) {
            for (let userKey in users) {
                if ('' === users[userKey].role_id) {
                    for (let roleId of roles) {
                        if (undefined === find(users, {role_id: roleId})) {
                            const roleTemplate = rolesTemplate[roleId];
                            users[userKey].role_id = roleId;
                            users[userKey].group = roleTemplate.group;
                            users[userKey].number = Number(Object.keys(roles).find(key => roles[key] == roleId));
                        }
                    }
                }
            }

            result = true;
        }

        return result;
    }

    setStateCheckRole(context) {
        let result = false;

        if (true === this._isChangeState(context, this.state.checkRole)) {
            context.state.gameStates[this.gameStatesId].state = this.state.checkRole;
            result = true;
        }

        return result;
    }

    setStateEndGame(context) {
        let result = false;

        if (true === this._isChangeState(context, this.state.endGame)) {
            context.state.gameStates[this.gameStatesId].state = this.state.endGame;

            result = true;
        }

        return result;
    }


    setGameRound(context, nowGameRound) {
        let gameRounds = context.state.gameStates[this.gameStatesId].gameRounds;
        const mapping = gameRounds.find(gameRound => gameRound.round === nowGameRound);
        let result = false;

        if (undefined === mapping) {
            context.state.gameStates[this.gameStatesId].gameRounds.push({round: nowGameRound, users: []});

            result = true;
        }

        return result;
    }

    getGameRound(context) {
        const gameRounds = context.state.gameStates[this.gameStatesId].gameRounds;
        const gameRoundNumber = gameRounds.length;

        return {
            gameRounds: gameRounds,
            gameRoundNumber: gameRoundNumber,
            nowGameRound: gameRounds[gameRoundNumber - 1],
        };
    }

    setUserGroup(context, transformUsers, checkGroup, newGroup) {
        let users = context.state.gameStates[this.gameStatesId].users;

        for (let transformUserId of transformUsers) {
            let userTarget = users.find(user => user.id === transformUserId && checkGroup.includes(user.group));
            if (undefined !== userTarget) {
                userTarget.group = newGroup;
            }
        }
    }

    setGameRoundResult(context, result) {
        let gameRoundResult = context.state.gameStates[this.gameStatesId].gameRoundResult;

        for (let val of result) {
            if (true === val) {
                gameRoundResult.people += 1;
            } else {
                gameRoundResult.immunity += 1;
            }
        }

        return gameRoundResult;
    }

    setScenes(context, newGameRound, sceneIds) {
        let scenes = context.state.gameStates[this.gameStatesId].scenes;
        const mapping = scenes.find(scene => scene.round === newGameRound);

        if (undefined === mapping) {
            context.state.gameStates[this.gameStatesId].scenes.push({round: newGameRound, scenes: sceneIds});
        }
    }

    getNowScenes(context, gameRound) {
        const scenes = context.state.gameStates[this.gameStatesId].scenes;
        const gameRoundScene = scenes.find(scene => scene.round === Number(gameRound));

        let nowScenes = [];

        if (undefined !== gameRoundScene) {
            nowScenes = gameRoundScene.scenes;
        }

        return nowScenes;
    }

    setGameRoundScene(context, newGameRound, userId, sceneId) {
        const { find } = require("lodash");
        const gameRounds = context.state.gameStates[this.gameStatesId].gameRounds;
        const scenes = context.state.gameStates[this.gameStatesId].scenes;
        const users = context.state.gameStates[this.gameStatesId].users;
        const gameRound = find(gameRounds, gameRound => Number(newGameRound) === gameRound.round);
        const scene = find(scenes, scene => Number(newGameRound) === scene.round);

        let result = false;
        if (undefined !== gameRound && undefined !== scene) {
            let gameRoundUsers = find(gameRound.users, gameRoundUser => userId === gameRoundUser.userId);
            let gameRoundScene = find(scene.scenes, gameRoundScene => sceneId === gameRoundScene);

            if (undefined === gameRoundUsers && undefined !== gameRoundScene) {
                let user = users.find(user => user.id === userId);

                gameRound.users.push({userId: userId, sceneId: sceneId, group: user.group});
                result = true;
            }
        }

        return result;
    }

    isGameRoundEnd(context, nowGameRound, sceneIds) {
        const { find } = require("lodash");
        const users = context.state.gameStates[this.gameStatesId].users;
        const gameRounds = context.state.gameStates[this.gameStatesId].gameRounds;
        const gameRound = find(gameRounds, gameRound => Number(nowGameRound) === gameRound.round);

        let result = false;

        if (undefined !== gameRound) {
            let userIds = [];

            for(let user of gameRound.users) {
                userIds.push(user.userId);
            }

            const mappings = find(users, user => user.type === this.user.type.user && !userIds.includes(user.id));

            if (undefined === mappings) {
                for (let user of users) {
                    let sceneIdsKey = Math.floor(Math.random() * sceneIds.length);
                    this.setGameRoundScene(context, nowGameRound, user.id, sceneIds[sceneIdsKey]);
                }

                result = true;
            }
        }

        return result;
    }

    dumpAll(context) {
        return context.state.gameStates[this.gameStatesId];
    }

    dumpGame(context, roles) {
        const lang = require(`./../../resources/lang/${process.env.ROOT_LANG}/index`);

        const game = context.state.gameStates[this.gameStatesId];
        const users = game.users;
        const gameRounds = game.gameRounds;
        const scenes = game.scenes;

        let result = [];

        for (let gameRound of gameRounds) {
            let consoleUser = [];
            let gameRoundUsers = gameRound.users;
            let round = gameRound.round;
            consoleUser.push(`第${lang.number[gameRound.round]}回合`)

            let scene = scenes.find(scene => scene.round === round);
            let currentScene = [];
            for (let value of scene.scenes) {
                currentScene.push(`${lang.scenes.name[value]}`)
            }

            consoleUser.push(`可選場景:${currentScene.join(lang.gameRoundEndAnd)}`)

            for (let gameRoundUser of gameRoundUsers) {
                let user = users.find(user => user.id === gameRoundUser.userId);

                consoleUser.push(`\nLINEID:${user.id}`);
                consoleUser.push(`姓名:${user.name}`);
                consoleUser.push(`號碼:${lang.number[user.number]}${lang.gameEndNumber}`);
                consoleUser.push(`角色:${lang.roleCard[user.role_id]}`);
                consoleUser.push(`原始陣營:${lang.roleType[roles[user.role_id].group]}`);
                consoleUser.push(`當回合陣營:${lang.roleType[gameRoundUser.group]} => ${lang.roleType[user.group]}`);
                consoleUser.push(`選擇地區:${lang.scenes.name[gameRoundUser.sceneId]}`);
            }

            result.push(consoleUser.join(`\n`));
        }

        return result.join(`\n\n`);
    }

    _isChangeState(context, newState) {
        const nowState = context.state.gameStates[this.gameStatesId].state;
        let result = false;

        if (
            (this.state.newGame === nowState && this.state.joinGame === newState)
            || (this.state.joinGame === nowState && this.state.selectNumber === newState)
            || (this.state.selectNumber === nowState && this.state.checkRole === newState)
            || (this.state.checkRole === nowState && this.state.startGame === newState)
            || (this.state.startGame === nowState && this.state.endGame === newState)
        ) {
            result = true;
        }

        return result;
    }

    getLiffCheckRoleUsers(gameData) {
        const users = gameData.users;

        let result = [];
        for (let userTableId in users) {
            let user = users[userTableId];

            result.push({
                // userTableId: userTableId,
                userId: user.id,
                roleId: user.role_id,
                group: user.group,
                number: Number(user.number),
            });
        }

        return result;
    }

    getLiffNowScenes(gameData, gameRound) {
        const scenes = gameData.scenes;
        const gameRoundScene = scenes.find(scene => scene.round === Number(gameRound));

        let nowScenes = [];

        if (undefined !== gameRoundScene) {
            nowScenes = gameRoundScene.scenes;
        }

        return nowScenes;
    }
}

module.exports = GameState;