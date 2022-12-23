const { router, line} = require('bottender/router');
const IndexController = require('./app/controllers/IndexController');

module.exports = async function App(context)
{
    return router([
        line.postback((context) => {
            return IndexController.setSelectedNumber
        }),
        line.message((context) => {

            switch (context.event.text) {
                case 'start game':
                    return IndexController.getSelectNumber;
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
