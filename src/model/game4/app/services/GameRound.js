class GameRound
{
    constructor() {
        this.gameRoundResultContent = {
            result1: 1,
            result2: 2,
            result3: 3,
            result4: 4,
            result5: 5,
        };
    }

    getGameRoundResult(round, users, roleGroups, roleGroupsValue, scenes) {
        let result = {
            transformGroupUsers: [],
            resultContentTag: {},
        };

        const roundKey = `scene${round}`;
        let groupTypeByScene = {};
        users.forEach(user => {
            if(undefined === groupTypeByScene[user[roundKey]]) {
                groupTypeByScene[user[roundKey]] = {};
            }
            if(undefined === groupTypeByScene[user[roundKey]][roleGroups[user.group].value]) {
                groupTypeByScene[user[roundKey]][roleGroups[user.group].value] = [];
            }
            groupTypeByScene[user[roundKey]][roleGroups[user.group].value].push(user.id);
        });

        for (let scene in groupTypeByScene) {
            let group = groupTypeByScene[scene];
            if (undefined === group[roleGroupsValue.uninfected]) group[roleGroupsValue.uninfected] = [];
            if (undefined === group[roleGroupsValue.infected]) group[roleGroupsValue.infected] = [];
            let uninfectedCount = group[roleGroupsValue.uninfected].length;
            let infectedCount = group[roleGroupsValue.infected].length;

            if (scenes[scene].maxUserCount < (Number(uninfectedCount) + Number(infectedCount))) {
                result.resultContentTag[scene] = this.gameRoundResultContent.result5;
            } else if (0 === Number(infectedCount)) {
                result.resultContentTag[scene] = this.gameRoundResultContent.result1;
            } else if (Number(uninfectedCount) > Number(infectedCount)) {
                result.resultContentTag[scene] = this.gameRoundResultContent.result2;
            } else if (Number(uninfectedCount) === Number(infectedCount)) {
                result.resultContentTag[scene] = this.gameRoundResultContent.result3;
                result.transformGroupUsers = result.transformGroupUsers.concat(group[roleGroupsValue.uninfected]);
            } else if (Number(uninfectedCount) < Number(infectedCount)) {
                result.resultContentTag[scene] = this.gameRoundResultContent.result4;
                result.transformGroupUsers = result.transformGroupUsers.concat(group[roleGroupsValue.uninfected]);
            } else if (0 === Number(uninfectedCount)) {
                result.resultContentTag[scene] = this.gameRoundResultContent.result4;
            }
        }

        return result;
    }
}

module.exports = GameRound;