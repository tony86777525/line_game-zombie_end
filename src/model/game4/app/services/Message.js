
class Message
{
    constructor()
    {
        this.Lang = require(`./../../resources/lang/${process.env.ROOT_LANG}/index`);
        this.imagePath = `${process.env.ROOT_PATH}/assets/img/game4`;
        this.liffUri = `https://liff.line.me/${process.env.LINE_LIFF_ID}/liff2`;
    }

    getNewGameContents(context) {
        let contentText = this.Lang.newGame;
        let buttonTextJoinGame = this.Lang.joinGame;
        let buttonTextStartGame = this.Lang.startGame;

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "direction": "ltr",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": `${contentText}`,
                        "weight": "bold",
                        "size": "md",
                        "align": "center",
                        "wrap": true
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextJoinGame}`,
                            "data": "join game"
                        },
                        "margin": "md"
                    },
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextStartGame}`,
                            "data": "start game"
                        },
                        "margin": "md"
                    }
                ]
            }
        });
    }

    getJoinGameAlreadyContents(context, name) {
        let contentText = this.Lang.joinGameAlready;

        contentText = contentText.replace(/{name}/g, name);

        return context.replyText(`${contentText}`);
    }

    getJoinGameContents(context, name, userCount) {
        let contentText = this.Lang.joinGameState;
        let buttonTextJoinGame = this.Lang.joinGame;
        let buttonTextStartGame = this.Lang.startGame;

        contentText = contentText.replace(/{name}/g, name).replace(/{userCount}/g, userCount);

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "direction": "ltr",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": `${contentText}`,
                        "weight": "bold",
                        "size": "md",
                        "align": "center",
                        "wrap": true
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextJoinGame}`,
                            "data": "join game"
                        },
                        "margin": "md"
                    },
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextStartGame}`,
                            "data": "start game"
                        },
                        "margin": "md"
                    }
                ]
            }
        });
    }

    getStartToSelectNumberContents(context, userCount, robotCount) {
        let contentText = this.Lang.startToSelectNumber;
        let robotCountText = '';
        if (robotCount > 0) {
            robotCountText = this.Lang.startToSelectNumberRobotCount;
            robotCountText = robotCountText.replace(/{robotCount}/g, robotCount)
        }
        contentText = contentText.replace(/{userCount}/g, userCount).replace(/{robotCountText}/g, robotCountText);

        return context.replyText(`${contentText}`);
    }

    getSelectNumberContents(context, roles, users) {
        const { find } = require('lodash');
        let contents = [];

        let unSelectNumber = this.Lang.unSelectNumber;
        let selectedNumber = this.Lang.selectedNumber;
        let contentText = 'Select Number';

        for (let key in roles) {
            let contentHeaderText = this.Lang.selectNumber[key];
            let isUnSelected = true;
            let roleImage = Number(key) + 1;
            let heroUrl = `${this.imagePath}/numbers/${roleImage}.jpg`;
            let data = `role=${roles[key]}`;

            if (undefined !== find(users, {role_id: roles[key]})) isUnSelected = false;

            contents.push({
                "type": "bubble",
                "direction": "ltr",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": `${contentHeaderText}`,
                            "weight": "bold",
                            "size": "xxl",
                            "align": "center",
                            "gravity": "center",
                            "contents": []
                        }
                    ]
                },
                "hero": {
                    "type": "image",
                    "url": `${heroUrl}`,
                    "size": "full",
                    "aspectRatio": "20:13",
                    "aspectMode": "fit",
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "button",
                            "style": true === isUnSelected ? "primary" : "secondary",
                            "action": {
                                "type": "postback",
                                "label": true === isUnSelected ? `${unSelectNumber}` : `${selectedNumber}`,
                                "data": `${data}`
                            },
                            "margin": "md"
                        },
                    ]
                }
            });
        }

        return context.replyFlex(`${contentText}`, {
            "type": "carousel",
            "contents": contents
        });
    }

    getSelectNumberAlreadyContents(context) {
        let contentText = this.Lang.selectNumberAlready;

        return context.replyText(`${contentText}`);
    }

    // open liff
    getCheckRoleContents(context, users) {
        const contentText = this.Lang.checkRole;
        const data = `${this.liffUri}/role?data=${encodeURIComponent(JSON.stringify(users))}`;

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "direction": "ltr",
            "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "uri",
                            "label": `${contentText}`,
                            "uri": `${data}`
                        },
                        "margin": "md"
                    }
                ]
            }
        });
    }

    getStartGameContents(context) {
        const contentText = this.Lang.gameStartStory;

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "direction": "ltr",
            "size": "giga",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": `${contentText}`,
                        "weight": "bold",
                        "size": "md",
                        "align": "start",
                        "wrap": true
                    }
                ]
            },
        });
    }

    getGameRoundContents(context, gameRound, users, sceneIds, newSceneNames) {
        let contentText = this.Lang.gameRound;
        const checkRoundText = this.Lang.checkRound;

        while (/{sceneText}/.test(contentText) && newSceneNames.length > 0) {
            contentText = contentText.replace(/{sceneText}/, newSceneNames.shift())
        }

        let uri = `${this.liffUri}/round?users=${encodeURIComponent(JSON.stringify(users))}`;
        uri += `&scenes=${encodeURIComponent(JSON.stringify(sceneIds))}&round=${gameRound}`;

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "direction": "ltr",
            "size": "giga",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": `${contentText}`,
                        "weight": "bold",
                        "size": "md",
                        "align": "start",
                        "wrap": true
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "uri",
                            "label": `${checkRoundText}`,
                            "uri": `${uri}`
                        },
                        "margin": "md"
                    }
                ]
            }
        });
    }

    getStoryHandleContents() {
        const url = `https://i.imgur.com/MwS42AE.png?sender=startGame`;

        return [
            {
                type: 'image',
                originalContentUrl: `${url}`,
                previewImageUrl: `${url}`,
            }
        ];
    }

    getSelectSceneHandleContents(scenes, round) {
        let result = {};

        for (let scene of scenes) {
            let url = `https://i.imgur.com/MwS42AE.png?sender=selectScene&sceneId=${scene.id}&round=${round}`;

            result[scene.id] = [{
                type: 'image',
                originalContentUrl: `${url}`,
                previewImageUrl: `${url}`,
            }];
        }

        return result;
    }

    getGameRoundEndContents(context, resultContentTags) {
        let contentArray = [];
        for (let sceneId in resultContentTags) {
            let resultContentTag = resultContentTags[sceneId];
            let contentText = this.Lang.gameRoundEnd;
            let contentAndText = this.Lang.gameRoundEndAnd
            let contentResultText = this.Lang.gameRoundEndResult[resultContentTag];
            let sceneText = this.Lang.scenes.name[sceneId];

            contentText = contentText.replace(/{sceneText}/, sceneText);
            contentText = contentText.replace(/{resultText}/, contentResultText);
            contentArray.push(contentText);
        }

        let contentText = contentArray.join("\n\n");
        // while (/{sceneText}/.test(contentText) && newSceneNames.length > 0) {
        //     contentText = contentText.replace(/{sceneText}/, newSceneNames.shift())
        // }

        // let uri = `${this.liffUri}/round?users=${encodeURIComponent(JSON.stringify(users))}`;
        // uri += `&scenes=${encodeURIComponent(JSON.stringify(sceneIds))}&round=${gameRound}`;

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "direction": "ltr",
            "size": "giga",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": `${contentText}`,
                        "weight": "bold",
                        "size": "md",
                        "align": "start",
                        "wrap": true
                    }
                ]
            },
            // "footer": {
            //     "type": "box",
            //     "layout": "vertical",
            //     "contents": [
            //         {
            //             "type": "button",
            //             "style": "primary",
            //             "action": {
            //                 "type": "uri",
            //                 "label": `${checkRoundText}`,
            //                 "uri": `${uri}`
            //             },
            //             "margin": "md"
            //         }
            //     ]
            // }
        });
    }

    getErrorContents(context) {
        const contentText = this.Lang.error;

        return context.replyText(contentText);
    }
}

module.exports = Message;