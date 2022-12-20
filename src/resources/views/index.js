const common = require('./common');
const presenter = require(common.route.presenter + 'message');

module.exports = async function App(context) {

    return presenter.messenger.flexMessageResponse(context);
};