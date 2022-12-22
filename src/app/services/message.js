const $content = {
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

class Message
{
    constructor()
    {
        this.imagePath = undefined;
        this.selectNumber = undefined;
    }

    setImagePath($imagePath)
    {
        this.imagePath = $imagePath;

        return this;
    }


    setSelectNumber($selectNumber)
    {
        this.selectNumber = $selectNumber;

        return this;
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

    _getFooterContent($buttonText, $buttonValue)
    {

        return {
            "type": "button",
            "action": {
                "type": "postback",
                "label": $buttonText,
                "data": $buttonValue
            }
        };
    }

    getSelectNumberContents()
    {
        let contents = [];

        if (undefined === this.selectNumber
            || undefined === this.imagePath) return contents;

        for (let key in this.selectNumber) {
            let value = this.selectNumber[key];

            let content = Object.assign({}, $content) ;
            console.log($content);
            content.header.contents.push(this._getHeaderContent("數字" + value));
            content.hero.url = this.imagePath + 'src/public/assets/img/game/numbers/' + key + '.jpg';
            content.footer.contents.push(this._getFooterContent('選擇號碼', key))
            contents.push(content);
        }

        return contents;
    }
}

module.exports = Message;