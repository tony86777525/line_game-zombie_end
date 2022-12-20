const { router, text } = require('bottender/router');
const indexController = require('./app/controllers/IndexController');

module.exports = async function App(context) {

    return router([
        text('*', indexController),
        // text('*', textRandom),
    ]);
};
