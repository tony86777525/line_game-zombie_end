
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

    getStartGameContents(context, users, sceneIds) {
        const contentText = this.Lang.gameStartStory;
        const checkRoundText = this.Lang.checkRound;

        let uri = `${this.liffUri}/round?users=${encodeURIComponent(JSON.stringify(users))}`;
        uri += `&scenes=${encodeURIComponent(JSON.stringify(sceneIds))}`;

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

    getSelectSceneHandleContents(scenes) {
        let result = [];

        for (let sceneId in scenes) {
            let url = `https://i.imgur.com/MwS42AE.png?sender=selectScene&sceneId=${sceneId}`;

            result.push(
                {
                    id: sceneId,
                    type: 'image',
                    originalContentUrl: `${url}`,
                    previewImageUrl: `${url}`,
                }
            );
        }

        return result;
    }

    getErrorContents(context, users) {
        const contentText = this.Lang.error;

        return context.replyText(contentText);
    }

    sendContents($type)
    {
        switch ($type) {
            case 'story':
                return '21世紀，一場無妄之災降臨地球，從養老院第一起咬人事件起，人們逐漸察覺到“變異者”的存在。起初，政府試圖隱瞞病毒事件，直到各種爭議四起，矛頭指向了P4生物研究所，很多人認為那裏是變異病毒的始源地，然而也有人認為，那是冰封15000年甚至更久的病毒在經歷了全球變暖後再次重見天日……\n' +
                    '末日降臨，人類秩序被打亂，地球陷入了史無前例的危機之中，越來越多的變異者開始攻擊人類，想要活下去，首先得保證物資的充足。\n' +
                    '“我們需要尋找食物、水，還有更多倖存者，我們需要互相幫助，才能生存下去。”\n';
            case 'round':
                return '這裏是H州救援隊，我們已經收到了你的求救信號！\n' +
                    '目前地面道路已被變異者攻陷，我們將派出直升機前往救援，預計需要三天時間！\n' +
                    '請不要慌張，我們已經通過衛星訊號為你找到可搜尋物資的躲藏點，\n' +
                    '離你最近的建築有（）和（），\n' +
                    '我們不確定裏面是否有變異者，\n' +
                    '在救援隊趕來之前請保證自身安全，\n' +
                    '祝你平安/好運！\n';
            case 'result':
                let $a = '1';
                let $b = '2';
                let $content = ''
                $content += '您好！\n' +
                    '收到本次的任務回報，\n' +
                    '一號和三號前去藥房搜索，\n';
                switch ($a) {
                    case "1":
                        $content = '那裡出乎意料的安全，找到了不少物資。\n';
                        break;
                    case "2":
                        $content = '那裡有少量的喪屍，但不影響搜索物資。\n';
                        break;
                    case "3":
                        $content = '那裡有不少喪屍，所有物資都被破壞了。\n';
                        break;
                    case "4":
                        $content = '那裡聚集了許多喪屍，大家只顧著逃命。\n';
                        break;
                    case "5":
                        $content = '那裡什麼也沒有，沒有物資、沒有喪屍。\n';
                        break;
                }

                $content += '二號、四號五號去市公所搜索，\n';
                switch ($b) {
                    case "1":
                        $content = '那裡出乎意料的安全，找到了不少物資。\n';
                        break;
                    case "2":
                        $content = '那裡有少量的喪屍，但不影響搜索物資。\n';
                        break;
                    case "3":
                        $content = '那裡有不少喪屍，所有物資都被破壞了。\n';
                        break;
                    case "4":
                        $content = '那裡聚集了許多喪屍，大家只顧著逃命。\n';
                        break;
                    case "5":
                        $content = '那裡什麼也沒有，沒有物資、沒有喪屍。\n';
                        break;
                }
                return $content;
        }
    }

}

module.exports = Message;