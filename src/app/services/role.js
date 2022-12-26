class Role
{
    constructor() {
        this.imagePath = undefined;
        this.users = [];
        this.userCount = 5;
    }

    setImagePath($imagePath)
    {
        this.imagePath = $imagePath;

        return this;
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
        template.push({
            name: 'dog',
            type: 1,
            group: 1,
            image: 'infected1.png',
        });
        if (8 <= this.userCount){
            template.push(
                {
                    name: 'doctor',
                    type: 1,
                    group: 1,
                    image: 'doctor.png',
                }
            );
        }
        if (10 <= this.userCount){
            template.push(
                {
                    name: 'police',
                    type: 1,
                    group: 1,
                    image: 'police.png',
                }
            );
        }

        template = this._shuffle(template);

        let result = [
            {
                name: 'immunity',
                type: 1,
                group: 0,
                image: 'immunity.png',
            }
        ];

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
        let template = [
            {
                name: 'pathogen1',
                type: -1,
                group: -1,
                image: 'pathogen1.png',
            },
            {
                name: 'pathogen2',
                type: -1,
                group: -1,
                image: 'pathogen2.png',
            },
            {
                name: 'pathogen3',
                type: -1,
                group: -1,
                image: 'pathogen3.png',
            },
            {
                name: 'pathogen4',
                type: -1,
                group: -1,
                image: 'pathogen4.png',
            },
        ];

        template = this._shuffle(template);

        let result = [
            {
                name: 'pathogen',
                type: -1,
                group: -1,
                image: 'pathogen.png',
            },
        ];

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
        let template = [
            {
                name: 'neutral1',
                type: 1,
                image: 'neutral1.png',
            },
            {
                name: 'neutral2',
                type: 1,
                group: 1,
                image: 'neutral2.png',
            },
            {
                name: 'neutral3',
                type: 1,
                group: 1,
                image: 'neutral3.png',
            },
            {
                name: 'neutral4',
                type: 1,
                group: 1,
                image: 'neutral4.png',
            },
            {
                name: 'neutral5',
                type: 1,
                group: 1,
                image: 'neutral5.png',
            },
            {
                name: 'neutral6',
                type: 1,
                group: 1,
                image: 'neutral6.png',
            },
        ];

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