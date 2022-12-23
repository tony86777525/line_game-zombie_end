class Message
{
    constructor()
    {
        this.imagePath = undefined;
        this.selectNumber = undefined;
        this.selectedNumber = undefined;
    }

    setImagePath($imagePath)
    {
        this.imagePath = $imagePath;

        return this;
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

    _getContentTemplate()
    {
        return {
            "type": "bubble",
            "direction": "ltr",
            "header": {
                "type": "box",
                "layout": "horizontal",
                "contents": []
            },
            "hero": {
                "type": "image",
                "url": '',
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "fit",
            },
            "footer": {
                "type": "box",
                "layout": "horizontal",
                "contents": []
            }
        };
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

    _getFooterContent($style = true, $actionValue)
    {
        return {
            "type": "button",
            "style": false === $style ? 'secondary' : 'primary',
            "action": {
                "type": "postback",
                "label": false === $style ? '已選擇號碼' : '選擇號碼',
                "data": $actionValue
            }
        };
    }

    getSelectNumberContents()
    {
        let contents = [];

        if (undefined === this.selectNumber
            || undefined === this.imagePath) return contents;
        const { find } = require('lodash');

        for (let key in this.selectNumber) {
            let value = this.selectNumber[key];
            let $isUnSelected = true;
            const content = this._getContentTemplate()

            const { find } = require('lodash');
            if (undefined !== find(this.selectedNumber, ['number', ('number' + key)])) $isUnSelected = false;

            content.header.contents.push(this._getHeaderContent("數字" + value));
            content.hero.url = this.imagePath + 'src/public/assets/img/game/numbers/' + key + '.jpg';
            content.footer.contents.push(this._getFooterContent($isUnSelected, 'number' + key));
            contents.push(content);
        }

        return contents;
    }
}

module.exports = Message;