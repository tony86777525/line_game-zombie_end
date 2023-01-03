const { router, line } = require('bottender/router');
const querystring = require('querystring');
const IndexController = require('./app/controllers/IndexController');

module.exports = async function App(context) {
    if (context.event.isPostback) {
        if ('join game' === context.event.payload)
            return IndexController.joinGame(context);
        else if('start game' === context.event.payload)
            return IndexController.SelectNumber(context);
        else if(/^role=([\d]+)$/.test(context.event.payload))
            return IndexController.SetRole(context);
    } else if (context.event.isMessage) {
        if (true === context.event.isImage) {
            const $imageUrl = context.event.image.contentProvider.originalContentUrl;
            const params = _getParams($imageUrl);

            if ('startGame' === params.sender) {
                return IndexController.StartGame(context);
            }
            if ('selectScene' === params.sender) {
                return IndexController.SelectScene(context, params.round, params.sceneId);
            }
        }

        switch (context.event.text) {
            case 'new game':
                return IndexController.newGame(context);
            // case 'reset game':
            //     return IndexController.resetGame(context);
            case 'call db':
                return IndexController.callDB(context);
        }
    }

    return IndexController.index(context);
};

function _getParams(url) {
    const state = url;
    if (state) {
        const array = state.split('?');
        if (array.length == 2) {
            return querystring.parse(array[1]);
        }
    }

    return url || {};
}