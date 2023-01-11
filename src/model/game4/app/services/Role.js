class Role
{
    constructor() {
        this.Lang = require(`./../../resources/lang/${process.env.ROOT_LANG}/index`);
        this.users = [];
        this.userCount = 5;
        this.dogId = 12;
        this.doctorId = 13;
        this.policeId = 14;
        this.immunityId = 15;
        this.infectedId = [7, 8, 9, 10];
        this.pathogenId = 11;
        this.peopleId = [1, 2, 3, 4, 5, 6];

        this.roles = {
            1: {type: 1, power: 1, winner: 1, image: 'people1', group: 1},
            2: {type: 1, power: 1, winner: 1, image: 'people2', group: 1},
            3: {type: 1, power: 1, winner: 1, image: 'people3', group: 1},
            4: {type: 1, power: 1, winner: 1, image: 'people4', group: 1},
            5: {type: 1, power: 1, winner: 1, image: 'people5', group: 1},
            6: {type: 1, power: 1, winner: 1, image: 'people6', group: 1},
            7: {type: 2, power: 2, winner: 2, image: 'infected1', group: 2},
            8: {type: 2, power: 2, winner: 2, image: 'infected2', group: 2},
            9: {type: 2, power: 2, winner: 2, image: 'infected3', group: 2},
            10: {type: 2, power: 2, winner: 2, image: 'infected4', group: 2},
            11: {type: 2, power: 3, winner: 3, image: 'pathogen', group: 4},
            12: {type: 3, power: 4, winner: 4, image: 'dog', group: 1},
            13: {type: 3, power: 5, winner: 5, image: 'doctor', group: 1},
            14: {type: 3, power: 6, winner: 6, image: 'police', group: 1},
            15: {type: 3, power: 7, winner: 7, image: 'immunity', group: 3}
        };

        this.roleGroupsValue = {
            uninfected: 0,
            infected: 1
        }

        this.roleGroups = {
            1: {image: 'people', value: this.roleGroupsValue.uninfected, change: 1},
            2: {image: 'infected', value: this.roleGroupsValue.infected, change: 0},
            3: {image: 'immunity', value: this.roleGroupsValue.uninfected, change: 0},
            4: {image: 'pathogen', value: this.roleGroupsValue.infected, change: 0},
        };


    }

    getRolesTemplate() {
        return this.roles;
    }

    getRoleGroupsTemplate() {
        return this.roleGroups;
    }

    getRoleGroupsValueTemplate() {
        return this.roleGroupsValue;
    }

    getCanSeeAnyoneRole() {
        return this.dogId;
    }

    getCanSeeImmunityRole() {
        return this.policeId;
    }

    getImmunityRole() {
        return this.immunityId;
    }

    getDoctorRole() {
        return this.doctorId;
    }

    getChangeRoleGroupsTarget() {
        let targets = [];

        for (let groupId in this.roleGroups) {
            if (1 === this.roleGroups[groupId].change) {
                targets.push(Number(groupId));
            }
        }

        return {targets: targets, valueTarget: 2};
    }

    setUsers($users) {
        this.users = $users;
        this.userCount = $users.length;

        return this;
    }

    _shuffle(sourceArray) {
        for (let i = 0; i < sourceArray.length - 1; i++) {
            let j = i + Math.floor(Math.random() * (sourceArray.length - i));

            let temp = sourceArray[j];
            sourceArray[j] = sourceArray[i];
            sourceArray[i] = temp;
        }

        return sourceArray;
    }

    _getPeopleTemplate() {
        let getCountByUserCount = {
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 3,
            10: 3
        };
        let getCount = getCountByUserCount[this.userCount] - 1;
        let template = [];
        template.push(this.dogId);
        if (8 <= this.userCount){
            template.push(this.doctorId);
        }
        if (10 <= this.userCount){
            template.push(this.policeId);
        }

        template = this._shuffle(template);

        let result = [this.immunityId];

        for (let i = 0; i < getCount; i++) {
            result.push(template.pop());
        }

        return result;
    }

    _getInfectedTemplate() {
        let getCountByUserCount = {
            5: 2,
            6: 2,
            7: 3,
            8: 3,
            9: 3,
            10: 4
        };
        let getCount = getCountByUserCount[this.userCount] - 1;
        let template = this.infectedId;

        template = this._shuffle(template);

        let result = [this.pathogenId];

        for (let i = 0; i < getCount; i++) {
            result.push(template.pop());
        }

        return result;
    }

    _getNeutralTemplate() {
        let getCountByUserCount = {
            5: 1,
            6: 2,
            7: 2,
            8: 3,
            9: 3,
            10: 3
        };
        let getCount = getCountByUserCount[this.userCount];
        let template = this.peopleId;

        template = this._shuffle(template);

        let result = [];

        for (let i = 0; i < getCount; i++) {
            result.push(template.pop());
        }

        return result;
    }

    getRoles() {
        let $roles = [];

        $roles = $roles.concat(this._getPeopleTemplate());
        $roles = $roles.concat(this._getInfectedTemplate());
        $roles = $roles.concat(this._getNeutralTemplate());

        $roles = this._shuffle($roles);

        return $roles;
    }

    getLiffRoles() {
        const roleCards = this.roles;
        const roleGroups = this.roleGroups;
        let roles = {};

        for (let key in roleCards) {
            let roleCard = roleCards[key];
            let roleGroup = roleGroups[roleCard.group];

            roles[key] = {
                name: `${this.Lang.liff.role.name}${this.Lang.roleType[roleCard.type]}${this.Lang.roleCard[key]}`,
                image: roleCard.image,
                power: `${this.Lang.liff.role.power}${this.Lang.rolePower[roleCard.power]}`,
                winner: `${this.Lang.liff.role.winner}${this.Lang.roleWinner[roleCard.winner]}`,
                groupImage: roleGroup.image,
            };
        }

        return roles;
    }

    getLiffNumberGroupImages(roles) {
        const roleGroups = this.roleGroups;
        let groupImage = {};

        for (let role of roles) {
            let roleGroup = roleGroups[role.group];

            groupImage[role.number] = roleGroup.image;
        }

        return groupImage;
    }
}

module.exports = Role;