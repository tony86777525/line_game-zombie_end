class Role
{
    constructor() {
        this.users = [];
        this.userCount = 5;
        this.dogId = 12;
        this.doctorId = 13;
        this.policeId = 14;
        this.immunityId = 15;
        this.infectedId = [7, 8, 9, 10];
        this.pathogenId = 11;
        this.peopleId = [1, 2, 3, 4, 5, 6];
    }

    setUsers($users)
    {
        this.users = $users;
        this.userCount = $users.length;

        return this;
    }

    _shuffle(sourceArray)
    {
        for (let i = 0; i < sourceArray.length - 1; i++) {
            let j = i + Math.floor(Math.random() * (sourceArray.length - i));

            let temp = sourceArray[j];
            sourceArray[j] = sourceArray[i];
            sourceArray[i] = temp;
        }

        return sourceArray;
    }

    _getPeopleTemplate()
    {
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

    _getInfectedTemplate()
    {
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

    _getNeutralTemplate()
    {
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

    getRoles()
    {
        let $roles = [];

        $roles = $roles.concat(this._getPeopleTemplate());
        $roles = $roles.concat(this._getInfectedTemplate());
        $roles = $roles.concat(this._getNeutralTemplate());

        $roles = this._shuffle($roles);

        // for (let user of this.users) {
        //     let $role = $roles.pop();
        //     $role.id = user.id;
        //     $result.push($role);
        // }

        return $roles;
    }
}

module.exports = Role;