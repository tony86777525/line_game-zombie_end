
class Message
{
    constructor()
    {
        this.Lang = require(`./../../resources/lang/${process.env.ROOT_LANG}/index`);
        this.imagePath = `${process.env.ROOT_PATH}/assets/img/game4`;
        this.liffUri = `https://liff.line.me/${process.env.LINE_LIFF_ID}/liff2`;
    }

    getFollowContents(context) {
        let contentText = 'Welcome To Join Game';
        let buttonTextStartGame = this.Lang.startGame;
        let heroUrl = `${this.imagePath}/message/follow.jpg`;
        let bodyTitle = `末日危機`;
        let bodyStar = [];
        let bodyMember = [];
        let bodyType = [];

        let goldStar = {
            "type": "icon",
            "size": "sm",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
        };

        let grayStar = {
            "type": "icon",
            "size": "sm",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
        };

        while (bodyStar.length < 5) {
            if (bodyStar.length < 4) {
                bodyStar.push(goldStar);
            } else {
                bodyStar.push(grayStar);
            }
        }

        bodyStar.push({
            "type": "text",
            "text": "4.0",
            "size": "sm",
            "color": "#999999",
            "margin": "md",
            "flex": 0
        });

        bodyStar.push({
            "type": "text",
            "text": "79人評價",
            "size": "sm",
            "margin": "md",
            "color": "#999999",
            "align": "center"
        })

        bodyMember.push({
            "type": "text",
            "text": "遊戲人數",
            "color": "#aaaaaa",
            "flex": 2,
            "size": "sm"
        });

        bodyMember.push({
            "type": "text",
            "text": "5~10人",
            "wrap": true,
            "color": "#666666",
            "size": "sm",
            "flex": 5
        });

        bodyType.push({
            "type": "text",
            "text": "遊戲類型",
            "color": "#aaaaaa",
            "size": "sm",
            "flex": 2
        });

        bodyType.push({
            "type": "text",
            "text": "陣營、心機、派對",
            "wrap": true,
            "color": "#666666",
            "size": "sm",
            "flex": 5
        });

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": `${heroUrl}`,
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover",
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": `${bodyTitle}`,
                        "weight": "bold",
                        "size": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "baseline",
                        "margin": "md",
                        "contents": bodyStar
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": bodyMember
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": bodyType
                            }
                        ]
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "button",
                        "style": "secondary",
                        "height": "sm",
                        "action": {
                            "type": "uri",
                            "label": "遊戲規則",
                            "uri": "https://linecorp.com"
                        }
                    },
                    {
                        "type": "button",
                        "style": "primary",
                        "height": "sm",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextStartGame}`,
                            "data": "new game"
                        },
                    }
                ]
            }
        });
    }

    getNewGameContents(context, GameState) {
        let contentText = this.Lang.newGame;
        let buttonTextJoinGame = this.Lang.joinGame;
        let buttonTextStartGame = this.Lang.startGame;

        let mainContentText = {
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
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getJoinGameAlreadyContents(context, name) {
        let contentText = this.Lang.joinGameAlready;

        contentText = contentText.replace(/{name}/g, name);

        return context.replyText(`${contentText}`);
    }

    getJoinGameContents(context, GameState, name, userCount) {
        let contentText = this.Lang.joinGameState;
        let buttonTextJoinGame = this.Lang.joinGame;
        let buttonTextStartGame = this.Lang.startGame;

        contentText = contentText.replace(/{name}/g, name).replace(/{userCount}/g, userCount);
        let mainContentText = {
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
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getStartToSelectNumberContents(context, GameState, userCount, robotCount) {
        let contentText = this.Lang.startToSelectNumber;
        let robotCountText = '';
        if (robotCount > 0) {
            robotCountText = this.Lang.startToSelectNumberRobotCount;
            robotCountText = robotCountText.replace(/{robotCount}/g, robotCount)
        }
        contentText = contentText.replace(/{userCount}/g, userCount).replace(/{robotCountText}/g, robotCountText);

        GameState.setLastMessageContent(context, contentText);

        return context.replyText(`${contentText}`);
    }

    getSelectNumberContents(context, GameState, roles, users, userCount) {
        const { find } = require('lodash');
        let contents = [];

        let unSelectNumber = this.Lang.unSelectNumber;
        let selectedNumber = this.Lang.selectedNumber;
        let contentText = 'Select Number';

        for (let key in roles.slice(0, userCount)) {
            let contentHeaderText = `${this.Lang.selectNumberTitle}${this.Lang.number[key]}`;
            let isUnSelected = true;
            let roleImage = Number(key);
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

        let mainContentText = {
            "type": "carousel",
            "contents": contents
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getSelectNumberAlreadyContents(context) {
        let contentText = this.Lang.selectNumberAlready;

        return context.replyText(`${contentText}`);
    }

    // open liff
    getCheckRoleContents(context, GameState) {
        const contentText = this.Lang.checkRole;
        let groupId = "";

        if (undefined !== context.session.group) {
            groupId = context.session.group.id;
        } else if (undefined !== context.session.user) {
            groupId = context.session.user.id;
        }

        const uri = `${this.liffUri}/role?data=${groupId}`;

        let mainContentText = {
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
                            "uri": `${uri}`
                        },
                        "margin": "md"
                    }
                ]
            }
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getVotingRoundMessage(context, GameState, gameRound) {
        const contentText = this.Lang.votingRound;
        let groupId = "";

        if (undefined !== context.session.group) {
            groupId = context.session.group.id;
        } else if (undefined !== context.session.user) {
            groupId = context.session.user.id;
        }

        let uri = `${this.liffUri}/round?data=${groupId}&round=${gameRound}&gameRoundType=votingRound`;

        let mainContentText = {
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
                            "uri": `${uri}`
                        },
                        "margin": "md"
                    }
                ]
            }
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getVotingRoundAlreadyContents(context) {
        let contentText = this.Lang.votingRoundAlready;

        return context.replyText(`${contentText}`);
    }

    getVotingRoundNotAgreeContents(context) {
        let contentText = this.Lang.votingRoundNotAgree;

        return context.replyText(`${contentText}`);
    }

    getVotingRoundAllNotAgreeContents(context) {
        let contentText = this.Lang.votingRoundAllNotAgree;

        return context.replyText(`${contentText}`);
    }

    getStartGameContents(context, GameState) {
        const contentText = this.Lang.gameStartStory;

        let mainContentText = {
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
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getGameRoundContents(context, GameState, gameRound, newSceneNames) {
        let contentText = this.Lang.gameRound;
        const checkRoundText = this.Lang.checkRound;

        let groupId = "";

        if (undefined !== context.session.group) {
            groupId = context.session.group.id;
        } else if (undefined !== context.session.user) {
            groupId = context.session.user.id;
        }

        while (/{sceneText}/.test(contentText) && newSceneNames.length > 0) {
            contentText = contentText.replace(/{sceneText}/, newSceneNames.shift())
        }

        let uri = `${this.liffUri}/round?data=${groupId}&round=${gameRound}&gameRoundType=gameRound`;
        let mainContentText = {
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
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
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

    getVotingRoundHandleContents(isAgrees, round) {
        let result = {};

        for (let isAgree of isAgrees) {
            let url = `https://i.imgur.com/MwS42AE.png?sender=votingRound&isAgree=${isAgree}&round=${round}`;

            result[isAgree] = [{
                type: 'image',
                originalContentUrl: `${url}`,
                previewImageUrl: `${url}`,
            }];
        }

        return result;
    }

    getSelectRoleNumberHandleContents(users) {
        let result = {};

        for (let user of users) {
            let url = `https://i.imgur.com/MwS42AE.png?sender=selectRoleNumber&number=${user.number}`;

            result[Number(user.number)] = [{
                type: 'image',
                originalContentUrl: `${url}`,
                previewImageUrl: `${url}`,
            }];
        }

        return result;
    }

    getGameRoundEndContents(context, GameState, resultContentTags) {
        let contentArray = [];

        for (let sceneId in resultContentTags) {
            let resultContentTag = resultContentTags[sceneId];
            let contentText = this.Lang.gameRoundEnd;
            let userNumbers = resultContentTag.userNumbers;
            for (let key in userNumbers) {
                userNumbers[key] = `${this.Lang.number[userNumbers[key]]}${this.Lang.gameRoundEndNumber}`;
            }
            let contentUserNumberText = userNumbers.join(this.Lang.gameRoundEndAnd);
            let contentResultText = this.Lang.gameRoundEndResult[resultContentTag.result];
            let sceneText = this.Lang.scenes.name[sceneId];

            contentText = contentText.replace(/{userNumberText}/, contentUserNumberText);
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
        let mainContentText = {
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
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getGameFinaleContent(context, GameState, resultContentTag) {
        let contentText = this.Lang.gameFinale;
        const checkButtonText = this.Lang.gameFinaleButton;
        let userNumbers = [];

        for (let user of resultContentTag.users) {
            userNumbers.push(`${this.Lang.number[user.number]}${this.Lang.gameEndNumber}`);
        }

        let contentUserNumberText = this.Lang.gameEndResult[resultContentTag.result]
            + userNumbers.join(this.Lang.gameEndAnd);

        contentText = contentText.replace(/{resultText}/, contentUserNumberText);

        let groupId = "";

        if (undefined !== context.session.group) {
            groupId = context.session.group.id;
        } else if (undefined !== context.session.user) {
            groupId = context.session.user.id;
        }

        const uri = `${this.liffUri}/checkImmunity?data=${groupId}`;
        let mainContentText = {
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
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "button",
                        "style": "primary",
                        "action": {
                            "type": "uri",
                            "label": `${checkButtonText}`,
                            "uri": `${uri}`
                        },
                        "margin": "md"
                    }
                ]
            }
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getSelectRoleNumberResultContent(context, isRight) {
        let contentText = "";
        if (true === isRight) {
            contentText = this.Lang.selectRoleNumberRight;
        } else {
            contentText = this.Lang.selectRoleNumberWrong;
        }

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
            }
        });
    }

    getGameEndContent(context, GameState, resultContentTag) {
        let contentText = this.Lang.gameEnd;
        let userNumbers = [];

        for (let user of resultContentTag.users) {
            userNumbers.push(`${this.Lang.number[user.number]}${this.Lang.gameEndNumber}`);
        }

        let contentUserNumberText = this.Lang.gameEndResult[resultContentTag.result]
            + userNumbers.join(this.Lang.gameEndAnd);

        contentText = contentText.replace(/{resultText}/, contentUserNumberText);

        let buttonTextYes = this.Lang.yes;
        let buttonTextNo = this.Lang.no;
        let mainContentText = {
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
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "button",
                        "style": "link",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextYes}`,
                            "data": "new game"
                        },
                        "margin": "md"
                    },
                    {
                        "type": "button",
                        "style": "link",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextNo}`,
                            "data": "."
                        },
                        "margin": "md"
                    }
                ]
            }
        };

        GameState.setLastMessageContent(context, contentText, mainContentText);

        return context.replyFlex(`${contentText}`, mainContentText);
    }

    getResetGameContents(context) {
        let contentText = this.Lang.resetGame;
        let buttonTextYes = this.Lang.yes;
        let buttonTextNo = this.Lang.no;

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "direction": "ltr",
            "size": "mega",
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
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "button",
                        "style": "link",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextYes}`,
                            "data": "new game"
                        },
                        "margin": "md"
                    },
                    {
                        "type": "button",
                        "style": "link",
                        "action": {
                            "type": "postback",
                            "label": `${buttonTextNo}`,
                            "data": "reset game cancel"
                        },
                        "margin": "md"
                    }
                ]
            }
        });
    }

    getResetGameCancelContents(context) {
        let contentText = this.Lang.resetGameCancel;

        return context.replyFlex(`${contentText}`, {
            "type": "bubble",
            "direction": "ltr",
            "size": "mega",
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
            }
        });
    }

    getNoUserToStartGameContents(context) {
        const contentText = this.Lang.noUserToStartGame;

        return context.replyText(contentText);
    }

    getNotJoinGameUserSelectNumberContents(context) {
        const contentText = this.Lang.notJoinGameUserSelectNumber;

        return context.replyText(contentText);
    }

    getOverDateContents(context, lastMessageContent) {
        let returnMessage = [];
        const contentText = this.Lang.overDate;

        returnMessage.push(context.replyText(contentText));

        if ('' !== lastMessageContent.mainContentText) {
            returnMessage.push(context.replyFlex(lastMessageContent.contentText
                , lastMessageContent.mainContentText));
        } else {
            returnMessage.push(context.replyText(lastMessageContent.contentText));
        }

        return returnMessage;
    }

    getErrorContents(context) {
        const contentText = this.Lang.error;

        return context.replyText(contentText);
    }

    getLiffRoles(roleCards, roleGroups) {
        let roles = {};

        for (let key in roleCards) {
            let roleCard = roleCards[key];
            let roleGroup = roleGroups[roleCard.group];

            roles[key] = {
                name: `${this.Lang.liff.role.name}${this.Lang.roleType[roleCard.type]} ${this.Lang.roleCard[key]}`,
                image: roleCard.image,
                power: `${this.Lang.liff.role.power}${this.Lang.rolePower[roleCard.power]}`,
                winner: `${this.Lang.liff.role.winner}${this.Lang.roleWinner[roleCard.winner]}`,
                groupImage: roleGroup.image,
            };
        }

        return roles;
    }

    getLiffRoundMessage(gameData, gameRound, doctorRoleId) {
        let contentText = this.Lang.liff.role.doctorMessage;
        const users = gameData.transformUser.filter(transformUser => transformUser.round === Number(gameRound));
        let result = [];

        if (undefined !== users) {
            contentText = contentText.replace(/{userCount}/, users.length);

            result.push({roleId: doctorRoleId, message: contentText});
        }

        return result;
    }

    getLiffVotingRoundMessage(scenesCount, scenes) {
        let titleText = this.Lang.liff.voting.title;
        let contentSceneText = this.Lang.liff.voting.contentScene;
        let contentStayText = this.Lang.liff.voting.contentStay;

        let result = {
            title: titleText,
            content: []
        };

        result.title = titleText;

        for (let sceneId in scenesCount) {
            let userCount = scenesCount[sceneId].length;
            let scene = scenes.find(scene => scene.id === sceneId);

            if (undefined !== scene) {
                let contentText = contentSceneText;
                if (Number(sceneId) === 0) {
                    contentText = contentStayText;
                }
                result.content.push(contentText.replace(/{userCount}/, userCount)
                    .replace(/{sceneText}/, scene.name));

            }
        }

        return result;
    }
}

module.exports = Message;