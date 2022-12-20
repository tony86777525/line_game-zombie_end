const presenter = require('./../presenters/index');

module.exports = async function App(context) {
    // const view = require('/src/resources/views/index/index.js');


    return textFlex;
};

async function textRandom() {
    return presenter.messenger.randomMessageResponse;
}
async function textFlex(context) {
    return presenter.messenger.flexMessageResponse(context);
}