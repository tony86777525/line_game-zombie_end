const { router, line, text} = require('bottender/router');
const querystring = require('querystring');
const IndexController = require('./app/controllers/IndexController');

module.exports = async function App(context)
{
    return router([
        line.postback((context) => {
            console.log(context.event.payload);
            if ('join game' === context.event.payload) return IndexController.joinGame;
            else if('start game' === context.event.payload) return IndexController.startGame;
            else if(/^role=([\d]+)$/.test(context.event.payload)) return IndexController.setRole;
        }),
        // line.
        line.message((context) => {
            switch (context.event.text) {
                case 'new game':
                    return IndexController.newGame;
                case 'reset game':
                    return IndexController.resetGame;
                case 'call db':
                    return IndexController.callDB;
            }

            if (true === context.event.isImage) {
                const $imageUrl = context.event.image.contentProvider.originalContentUrl;
                const params = getParams($imageUrl);

                return IndexController.liffToSendMessage(context, params);
            }
        }),
        line.any(HandleLine),
        // messenger.postback(indexController.setSelectedNumber),

        // text('*', textRandom),
    ]);
};

async function HandleLine(context)
{
    return IndexController.index;
}


function getParams(url) {
    const state = url;
    if (state) {
        const array = state.split('?');
        if (array.length == 2) {
            return querystring.parse(array[1]);
        }
    }

    return url || {};
}