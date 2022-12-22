const common = require('./common');
const gameConfig = require(common.route.config + 'game');
const presenter = require(common.route.presenter + 'message');
const messageService = require(common.route.service + 'message');


module.exports = async function App(context) {
    let $messageService = new messageService;

    // return presenter.messenger.flexMessageResponse(context);
    return context.replyFlex('123', {
            "type": "carousel",
            "contents":
                $messageService
                .setImagePath(gameConfig.imagePath)
                .setSelectNumber(gameConfig.selectNumber)
                .getSelectNumberContents()
        }
    );
};