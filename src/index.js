const { router, line} = require('bottender/router');
const IndexController = require('./app/controllers/IndexController');

module.exports = async function App(context)
{
    return router([
        line.postback(HandlePostback),
        line.message(HandleMessage),
        line.any(HandleLine),
        // messenger.postback(indexController.setSelectedNumber),

        // text('*', textRandom),
    ]);
};

async function HandlePostback(context) {

    return IndexController.setSelectedNumber;
}

async function HandleMessage(context) {
    return IndexController.getSelectNumber;
}

async function HandleLine(context)
{
    return IndexController.index;
}
