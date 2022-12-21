const common = require('./common');
const presenter = require(common.route.presenter + 'message');
const fs = require('fs');

module.exports = async function App(context) {
    const image = fs.createReadStream('./public/assets/img/game/numbers/0.jpg');
    return context.sendImage({'type': 'image',
        'originalContentUrl': image.toString('base64')});
    // return presenter.messenger.flexMessageResponse(context);
};