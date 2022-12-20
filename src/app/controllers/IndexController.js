const common = require('./CommonController');

module.exports = async function App(context) {
    const view = require(common.route.view + 'index');

    return view;
};