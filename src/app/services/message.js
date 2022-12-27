class Message
{
    constructor()
    {
        this.imagePath = `${process.env.ROOT_PATH}`;
        this.selectNumber = undefined;
        this.roles = undefined;
        this.isContentTemplateHeader = false;
        this.isContentTemplateHero = false;
        this.isContentTemplateBody = false;
        this.liffUri = `https://liff.line.me/${process.env.LINE_LIFF_ID}`;
    }

    setSelectedNumber($selectedNumber)
    {
        this.selectedNumber = $selectedNumber;

        return this;
    }

    setSelectNumber($selectNumber)
    {
        this.selectNumber = $selectNumber;

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

        $template['footer'] = {
            "type": "box",
            "layout": "vertical",
            "contents": []
        };

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
        let contents = [];
        if (undefined === this.selectNumber
            || undefined === this.roles) return contents;

        for (let key in this.roles) {
            const content = this._getContentTemplate(true);
            let title = `數字${this.selectNumber[key]}`;
            let $isUnSelected = true;
            const { find } = require('lodash');
            if (undefined !== find(this.user, ['role_id', (`${key}`)])) $isUnSelected = false;

            content.header.contents.push(this._getHeaderContent(title));
            content.hero.url = `${this.imagePath}/assets/img/game/numbers/${parseInt(key) + 1}.jpg`;
            content.footer.contents.push(this._getFooterContent(
                false === $isUnSelected ? 'secondary' : 'primary'
                , false === $isUnSelected ? '已選擇號碼' : '選擇號碼'
                , false === $isUnSelected ? `${this.liffUri}` : `${this.liffUri}?type=role&role=${key}`
                , 'uri'));

            contents.push(content);
        }
        // for (let key in this.selectNumber) {
        //     let value = this.selectNumber[key];
        //     let $isUnSelected = true;
        //     const content = this._getContentTemplate(true);
        //
        //     const { find } = require('lodash');
        //     if (undefined !== find(this.selectedNumber, ['number', (`${key}`)])) $isUnSelected = false;
        //
        //     content.header.contents.push(this._getHeaderContent(`數字${value}`));
        //     content.hero.url = `${this.imagePath}src/public/assets/img/game/numbers/${key}.jpg`;
        //     content.footer.contents.push(this._getFooterContent(
        //         false === $isUnSelected ? 'secondary' : 'primary'
        //         , false === $isUnSelected ? '已選擇號碼' : '選擇號碼'
        //         , false === $isUnSelected ? ' ' : `selectNumber=${key}`));
        //     contents.push(content);
        // }

        return contents;
    }

    getLiffContents()
    {
        this.isContentTemplateBody = false;
        this.isContentTemplateHero = false;
        let contents = [];
        const content = this._getContentTemplate();

        content.footer.contents.push(this._getFooterContent('primary', '開啟LIFF', this.liffUri, 'uri'));
        contents.push(content);

        return contents;
    }
}

module.exports = Message;