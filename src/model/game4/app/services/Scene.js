class Scene
{
    constructor() {
        this.Lang = require(`./../../resources/lang/${process.env.ROOT_LANG}/index`);
        this.selectSceneCount = 2;
        this.scenes = {
            1: {maxUserCount: 2, image: '1.jpg'},
            2: {maxUserCount: 2, image: '2.jpg'},
            3: {maxUserCount: 3, image: '3.jpg'},
            4: {maxUserCount: 3, image: '4.jpg'},
            5: {maxUserCount: 4, image: '5.jpg'},
            6: {maxUserCount: 5, image: '6.jpg'},
        };
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

    getSceneIds() {
        let sceneIds = Object.keys(this.scenes);
        let newSceneIds = this._shuffle(sceneIds);

        newSceneIds = newSceneIds.slice(0, this.selectSceneCount);

        return newSceneIds;
    }

    getLiffScenes(scenesIds) {
        const scenes = this.scenes;

        let getScenes = {};

        for (let scenesId of scenesIds) {
            let scene = scenes[Number(scenesId)];

            getScenes[scenesId] = {
                name: this.Lang.scenes[scenesId],
                image: scene.image,
            };
        }

        return getScenes;
    }
}

module.exports = Scene;