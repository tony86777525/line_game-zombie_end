class Message
{
    constructor()
    {
        this.imagePath = `${process.env.ROOT_PATH}`;
        this.selectNumber = undefined;
        this.roles = undefined;
        this.users = undefined;
        this.isContentTemplateHeader = false;
        this.isContentTemplateHero = false;
        this.isContentTemplateBody = false;
        this.isContentTemplateFooter = false;
        this.liffUri = `https://liff.line.me/${process.env.LINE_LIFF_ID}/liff2`;
    }

    setSelectNumber($selectNumber)
    {
        this.selectNumber = $selectNumber;

        return this;
    }


    setUsers($users)
    {
        this.users = $users;

        return this;
    }

    setRoles($roles)
    {
        this.roles = $roles;

        return this;
    }

    _getContentTemplate()
    {
        let $template = {
            "type": "bubble",
            "direction": "ltr",
        };

        if (true === this.isContentTemplateHeader) {
            $template['header'] = {
                "type": "box",
                "layout": "vertical",
                "contents": []
            };
        }

        if (true === this.isContentTemplateBody) {
            $template['body'] = {
                "type": "box",
                "layout": "vertical",
                "contents": []
            };
        }

        if (true === this.isContentTemplateHero) {
            $template['hero'] = {
                "type": "image",
                "url": '',
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "fit",
            };
        }

        if (true === this.isContentTemplateFooter) {
            $template['footer'] = {
                "type": "box",
                "layout": "vertical",
                "contents": []
            };

        }

        return $template;
    }

    _getHeaderContent($titleText)
    {
        return {
            "type": "text",
            "text": $titleText,
            "weight": "bold",
            "size": "xxl",
            "align": "center",
            "gravity": "center",
            "contents": []
        };
    }

    _getBodyContent($text)
    {
        return {
            "type": "text",
            "text": $text,
            "weight": "bold",
            "size": "md",
            "align": "center",
            "wrap": true
        };
    }

    _getFooterContent($style = 'primary', $actionLabel = '', $actionValue, $type = 'postback')
    {
        let action = {};
        if ('postback' === $type) {
            action = {
                "type": "postback",
                "label": $actionLabel,
                "data": $actionValue
            };
        } else if ('uri' === $type) {
            action = {
                "type": "uri",
                "label": $actionLabel,
                "uri": $actionValue
            };
        }

        return {
            "type": "button",
            "style": $style,
            "action": action,
            "margin": "md"
        };
    }

    getNewGameContents($text)
    {
        this.isContentTemplateBody = true;
        this.isContentTemplateHero = false;
        this.isContentTemplateFooter = true;
        let contents = [];
        const content = this._getContentTemplate();

        content.body.contents.push(this._getBodyContent($text));
        content.footer.contents.push(this._getFooterContent('primary', '加入遊戲', 'join game'));
        content.footer.contents.push(this._getFooterContent('primary', '開始遊戲', 'start game'));
        contents.push(content);

        return contents;
    }

    getJoinGameContents()
    {
        this.isContentTemplateHeader = true;
        this.isContentTemplateHero = true;
        this.isContentTemplateBody = false;
        this.isContentTemplateFooter = true;
        let contents = [];
        if (undefined === this.selectNumber
            || undefined === this.roles) return contents;

        let imgNumber = 0;
        for (let key of this.roles) {
            imgNumber++;
            const content = this._getContentTemplate(true);
            let title = `數字${this.selectNumber[imgNumber]}`;
            let $isUnSelected = true;
            const { find } = require('lodash');

            if (undefined !== find(this.users, ['role_id', (`${key}`)])) $isUnSelected = false;

            content.header.contents.push(this._getHeaderContent(title));
            content.hero.url = `${this.imagePath}/assets/img/game/numbers/${imgNumber}.jpg`;
            content.footer.contents.push(this._getFooterContent(
                false === $isUnSelected ? 'secondary' : 'primary'
                , false === $isUnSelected ? '已選擇號碼' : '選擇號碼'
                , false === $isUnSelected ? ' ' : `role=${key}`));

            contents.push(content);
        }

        return contents;
    }

    getRoleLiffContents($roleId)
    {
        this.isContentTemplateBody = false;
        this.isContentTemplateHero = false;
        this.isContentTemplateFooter = true;
        let contents = [];
        const content = this._getContentTemplate();

        content.footer.contents.push(this._getFooterContent('primary', '開啟LIFF'
            , `${this.liffUri}/role?role=${$roleId}`
            , 'uri'));
        contents.push(content);

        return contents;
    }

    getStoryHandleContents()
    {
        return [
            {
                type: 'image',
                originalContentUrl: 'https://i.imgur.com/MwS42AE.png?sender=story',
                previewImageUrl: 'https://i.imgur.com/MwS42AE.png?sender=story',
            }
        ];
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