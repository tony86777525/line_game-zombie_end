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

    getScenesTemplate() {
        return this.scenes;
    }

    getSceneIds() {
        let sceneIds = Object.keys(this.scenes);
        let newSceneIds = this._shuffle(sceneIds);

        newSceneIds = newSceneIds.slice(0, this.selectSceneCount);

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
                content: this.Lang.scenes.content[sceneId],
                image: scene.image,
            });
        }

        return getScenes;
    }
}

module.exports = Scene;