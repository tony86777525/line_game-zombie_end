class Scene
{
    constructor() {
        this.Lang = require(`./../../resources/lang/${process.env.ROOT_LANG}/index`);
        this.selectSceneCount = 2;
        this.scenes = {
            1: {maxUserCount: 2, image: '1'},
            2: {maxUserCount: 2, image: '2'},
            3: {maxUserCount: 3, image: '3'},
            4: {maxUserCount: 3, image: '4'},
            5: {maxUserCount: 4, image: '5'},
            6: {maxUserCount: 5, image: '6'},
            7: {maxUserCount: 5, image: '7'},
        };
        this.scenesProbability = {
            5: {
                1: 5,
                2: 2,
                3: 2,
                4: 1,
                5: 0,
                6: 0,
                7: 0,
            },
            6: {
                1: 18,
                2: 40,
                3: 18,
                4: 12,
                5: 12,
                6: 0,
                7: 0,
            },
            7: {
                1: 200,
                2: 225,
                3: 225,
                4: 175,
                5: 175,
                6: 0,
                7: 0,
            },
            8: {
                1: 10,
                2: 20,
                3: 20,
                4: 25,
                5: 25,
                6: 0,
                7: 0,
            },
            9: {
                1: 5,
                2: 15,
                3: 15,
                4: 15,
                5: 25,
                6: 25,
                7: 0,
            },
            10: {
                1: 2,
                2: 8,
                3: 8,
                4: 13,
                5: 19,
                6: 25,
                7: 25,
            },
        }
    }

    _shuffle(sourceArray, scenesProbability, selectSceneCount) {
        let denominator = [];
        let result = [];

        for (let i in scenesProbability) {
            let pushTotalCount = scenesProbability[i];
            let pushCount = 0;
            while (pushCount < pushTotalCount) {
                pushCount += 1;
                denominator.push(i);
            }
        }
        console.log(denominator);
        while (result.length < selectSceneCount) {
            let numerator = Math.floor(Math.random() * denominator.length);
            let currentSceneId = denominator[numerator];
            let mapping = result.find(sceneId => sceneId === currentSceneId);
            if (undefined === mapping) {
                result.push(currentSceneId);
            }
        }

        return result;
    }

    getScenesTemplate() {
        return this.scenes;
    }

    getSceneIds(usersCount) {
        let sceneIds = Object.keys(this.scenes);
        let scenesProbability = this.scenesProbability[usersCount];
        let newSceneIds = this._shuffle(sceneIds, scenesProbability, this.selectSceneCount);
console.log(newSceneIds);
        return newSceneIds;
    }

    getSceneNameByIds(sceneIds) {
        let result = [];
        sceneIds.forEach(sceneId => {
            result.push(this.Lang.scenes.name[sceneId]);
        });

        return result;
    }

    getLiffScenes(sceneIds) {
        const scenes = this.scenes;

        let getScenes = [];

        for (let sceneId of sceneIds) {
            let scene = scenes[Number(sceneId)];

            getScenes.push({
                id: sceneId,
                name: this.Lang.scenes.name[sceneId],
                content: this.Lang.scenes.content[sceneId],
                image: scene.image,
            });
        }

        return getScenes;
    }
}

module.exports = Scene;