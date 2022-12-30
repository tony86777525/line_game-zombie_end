const { router, line } = require('bottender/router');
const querystring = require('querystring');
const IndexController = require('./app/controllers/IndexController');

module.exports = async function App(context) {

    if (context.event.isPostback) {
        if ('join game' === context.event.payload) return IndexController.joinGame(context);
        else if('start game' === context.event.payload) return IndexController.startGame(context);
        else if(/^role=([\d]+)$/.test(context.event.payload)) return IndexController.setRole(context);
    } else if (context.event.isMessage) {
        if (true === context.event.isImage) {
            console.log('11');
            const $imageUrl = context.event.image.contentProvider.originalContentUrl;
            const params = _getParams($imageUrl);

            return IndexController.liffToSendMessage(context, params);
        }

        switch (context.event.text) {
            case 'new game':
                return IndexController.newGame(context);
            case 'reset game':
                return IndexController.resetGame(context);
            case 'call db':
                return IndexController.callDB(context);
        }
    }

    // return router([
    //     line.postback((context) => {
    //         console.log(context.event.payload);
    //         if ('join game' === context.event.payload) return IndexController.joinGame;
    //         else if('start game' === context.event.payload) return IndexController.startGame;
    //         else if(/^role=([\d]+)$/.test(context.event.payload)) return IndexController.setRole;
    //     }),
    //
    //     line.message((context) => {
    //         if (true === context.event.isImage) {
    //             console.log('11');
    //             const $imageUrl = context.event.image.contentProvider.originalContentUrl;
    //             const params = _getParams($imageUrl);
    //
    //             return IndexController.liffToSendMessage(context, params);
    //         }
    //
    //         switch (context.event.text) {
    //             case 'new game':
    //                 console.log('12');
    //                 return IndexController.newGame;
    //             case 'reset game':
    //                 console.log('13');
    //                 return IndexController.resetGame;
    //             case 'call db':
    //                 console.log('14');
    //                 return IndexController.callDB;
    //         }
    //
    //         console.log('15');
    //     }),
    //     line.any(HandleLine),
    // ]);
};

async function HandleLine(context)
{
    return IndexController.index;
}

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