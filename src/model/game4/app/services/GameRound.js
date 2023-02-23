class GameRound
{
    constructor() {
        this.gameRoundResultContent = {
            result1: 1,
            result2: 2,
            result3: 3,
            result4: 4,
            result5: 5,
            result6: 6,
        };

        this.gameRoundResult = {
            result1: true,
            result2: true,
            result3: false,
            result4: false,
            result5: false,
            result6: false,
        };

        this.gameResultContent = {
            result1: 1,
            result2: 2,
        };
    }

    getGameRoundResult(users, nowGameRound, roleGroups, roleGroupsValue, scenes) {
        let result = {
            transformGroupUsers: [],
            resultContentTag: {},
            result: [],
        };

        let groupTypeByScene = {};

        users.forEach(user => {
            const gameRoundUser = nowGameRound.users.find(nowGameRoundUser => nowGameRoundUser.userId === user.id);

            if(undefined === groupTypeByScene[gameRoundUser.sceneId]) {
                groupTypeByScene[gameRoundUser.sceneId] = {};
            }
            if(undefined === groupTypeByScene[gameRoundUser.sceneId][roleGroups[user.group].value]) {
                groupTypeByScene[gameRoundUser.sceneId][roleGroups[user.group].value] = [];
            }
            if(undefined === groupTypeByScene[gameRoundUser.sceneId]["userNumbers"]) {
                groupTypeByScene[gameRoundUser.sceneId]["userNumbers"] = [];
            }
            groupTypeByScene[gameRoundUser.sceneId][roleGroups[user.group].value].push(user.id);
            groupTypeByScene[gameRoundUser.sceneId]["userNumbers"].push(user.number);
        });

        for (let scene in groupTypeByScene) {
            let group = groupTypeByScene[scene];
            let resultScene = {};
            resultScene['userNumbers'] = group.userNumbers.sort();

            if ('0' === scene) {
                console.log(group.userNumbers.length, users.length);
                if (group.userNumbers.length === users.length) {
                    resultScene['result'] = this.gameRoundResultContent.result6;
                    result.result.push(this.gameRoundResult.result6);
                    result.resultContentTag[scene] = resultScene;
                }
            } else {
                if (undefined === group[roleGroupsValue.uninfected]) group[roleGroupsValue.uninfected] = [];
                if (undefined === group[roleGroupsValue.infected]) group[roleGroupsValue.infected] = [];
                let uninfecteds = group[roleGroupsValue.uninfected];
                let infecteds = group[roleGroupsValue.infected];
                let uninfectedCount = uninfecteds.length;
                let infectedCount = infecteds.length;

                if (scenes[scene].maxUserCount < (Number(uninfectedCount) + Number(infectedCount))) {
                    resultScene['result'] = this.gameRoundResultContent.result5;
                    result.result.push(this.gameRoundResult.result5);
                } else if (0 === Number(infectedCount)) {
                    resultScene['result'] = this.gameRoundResultContent.result1;
                    result.result.push(this.gameRoundResult.result1);
                } else if (0 === Number(uninfectedCount)) {
                    resultScene['result'] = this.gameRoundResultContent.result4;
                    result.result.push(this.gameRoundResult.result4);
                } else if (Number(uninfectedCount) > Number(infectedCount)) {
                    resultScene['result'] = this.gameRoundResultContent.result2;
                    result.result.push(this.gameRoundResult.result2);
                } else if (Number(uninfectedCount) === Number(infectedCount)) {
                    resultScene['result'] = this.gameRoundResultContent.result3;
                    result.result.push(this.gameRoundResult.result3);
                    result.transformGroupUsers = result.transformGroupUsers.concat(group[roleGroupsValue.uninfected]);
                } else if (Number(uninfectedCount) < Number(infectedCount)) {
                    resultScene['result'] = this.gameRoundResultContent.result4;
                    result.result.push(this.gameRoundResult.result4);
                    result.transformGroupUsers = result.transformGroupUsers.concat(group[roleGroupsValue.uninfected]);
                }

                result.resultContentTag[scene] = resultScene;
            }
        }

        return result;
    }

    getGameResult(winCount, users, isImmunityWin = false) {
        let resultContentTags = undefined;

        if (winCount.immunity >= 5 || true === isImmunityWin) {
            let groupIds = [2, 4];
            let resultContent = this.gameResultContent.result2;
            const winUsers = users.filter(user => groupIds.includes(user.group));

            resultContentTags = {
                result: resultContent,
                users: winUsers.sort((a, b) => {return a.number - b.number}),
                type: true
            };
        } else if (winCount.people >= 5) {
            let groupIds = [1, 3];
            let resultContent = this.gameResultContent.result1;
            const winUsers = users.filter(user => groupIds.includes(user.group));
            const pathogenUser = users.find(user => 11 === user.role_id && 1 === user.type);

            resultContentTags = {
                result: resultContent,
                users: winUsers.sort((a, b) => {return a - b}),
                // type: undefined !== pathogenUser ? true : false
                type: false
            };
        }

        return resultContentTags;
    }
}

module.exports = GameRound;