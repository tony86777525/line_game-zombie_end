const { router, line, text} = require('bottender/router');
const IndexController = require('./app/controllers/IndexController');

module.exports = async function App(context)
{
    return router([
        line.postback((context) => {
            console.log(context.event.payload);
            if ('join game' === context.event.payload) return IndexController.joinGame;
            else if('start game' === context.event.payload) return IndexController.startGame;
            // else if(/^role=([\d]+)$/.test(context.event.payload)) return IndexController.setSelectedNumber;
        }),
        line.message((context) => {
            switch (context.event.text) {
                case 'new game':
                    return IndexController.newGame;
                case 'reset game':
                    return IndexController.resetGame;
                case 'call db':
                    return IndexController.callDB;
            }
        }),
        line.any(HandleLine),
        // messenger.postback(indexController.setSelectedNumber),

        // text('*', textRandom),
    ]);
};

async function HandlePostback(context) {

    return IndexController.setSelectedNumber;
}

async function HandleLine(context)
{
    return IndexController.index;
}
