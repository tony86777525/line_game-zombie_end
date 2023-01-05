const {findKey, find} = require("lodash");

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
            gameRound: 0,
            users: [],
            roles: [],
            scenes: [],
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

    getCheckRoleUsers(context) {
        const users = context.state.gameStates[this.gameStatesId].users;

        let result = [];
        for (let user of users) {
            result.push({
                userId: user.id,
                roleId: user.role_id,
                group: user.group,
                number: Number(user.number),
            });
        }

        return result;
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
            users[userKey].number = Number(Object.keys(roles).find(key => roles[key] == roleId)) + 1,
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
                            users[userKey].number = Number(Object.keys(roles).find(key => roles[key] == roleId)) + 1;
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

    setGameRound(context, gameRound) {
        context.state.gameStates[this.gameStatesId].gameRound = gameRound;
    }

    getGameRound(context) {
        return context.state.gameStates[this.gameStatesId].gameRound;
    }

    setUserGroup(context, transformUsers, checkGroup, newGroup) {
        let users = context.state.gameStates[this.gameStatesId].users;
        for (let transformUserId of transformUsers) {
            let userTarget = users.find(user => user.id === transformUserId && user.group === checkGroup);
            userTarget.group = newGroup;
        }
    }

    setScenes(context, sceneIds) {
        context.state.gameStates[this.gameStatesId].scenes.push(sceneIds);
    }

    getNowScenes(context) {
        const scenes = context.state.gameStates[this.gameStatesId].scenes;

        return scenes[scenes.length - 1];
    }

    setGameRoundScene(context, gameRound, userId, sceneId) {
        const { find } = require("lodash");
        const users = context.state.gameStates[this.gameStatesId].users;
        const sceneKey = `scene${gameRound}`;
        const user = find(users, (user) => {
            return user.id === userId && undefined === user[sceneKey]
        });
        let result = false;

        if (undefined !== user) {
            user[sceneKey] = sceneId;
            result = true;
        }

        return result;
    }

    isGameRoundEnd(context, gameRound, sceneIds) {
        const { find } = require("lodash");
        const users = context.state.gameStates[this.gameStatesId].users;
        const sceneKey = `scene${gameRound}`;
        const mappings = find(users, user => user.type === this.user.type.user && undefined === user[sceneKey]);
        let result = false;

        if (undefined === mappings) {
            for (let userKey in users) {
                if (undefined === users[userKey][sceneKey]) {
                    let sceneIdsKey = Math.floor(Math.random() * sceneIds.length);
                    users[userKey][sceneKey] = sceneIds[sceneIdsKey];
                }
            }
            result = true;
        }

        return result;
    }

    dumpAll(context) {
        return context.state.gameStates[this.gameStatesId];
    }

    _isChangeState(context, newState) {
        const nowState = context.state.gameStates[this.gameStatesId].state;
        let result = false;

        if (
            (this.state.newGame === nowState && this.state.joinGame === newState)
            || (this.state.joinGame === nowState && this.state.selectNumber === newState)
            || (this.state.selectNumber === nowState && this.state.checkRole === newState)
            || (this.state.checkRole === nowState && this.state.startGame === newState)
        ) {
            result = true;
        }

        return result;
    }
}

module.exports = GameState;