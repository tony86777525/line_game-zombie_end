const querystring = require('querystring');
const IndexController = require('./app/controllers/IndexController');

module.exports = async function App(context) {
    // context.event.isLeave
    // context.event.isJoin
    // console.log(context.event);
    if (context.event.isFollow || context.event.isJoin) {
        return IndexController.WelcomeToJoinGame(context);
    }

    if (context.event.isPostback) {
        if ("new game" === context.event.payload)
            return IndexController.newGame(context);
        else if ('join game' === context.event.payload)
            return IndexController.joinGame(context);
        else if('start game' === context.event.payload)
            return IndexController.SelectNumber(context);
        else if('reset game cancel' === context.event.payload)
            return IndexController.ResetGameCancel(context);
        else if(/^role=([\d]+)$/.test(context.event.payload)) {
            const params = _getParams(context.event.payload);
            return IndexController.SetRole(context, params);
        }
    } else if (context.event.isMessage) {
        if (true === context.event.isImage) {
            const $imageUrl = context.event.image.contentProvider.originalContentUrl;
            const params = _getParams($imageUrl);

            if ('startGame' === params.sender) {
                return IndexController.StartGame(context);
            }
            if ('selectRoleNumber' === params.sender) {
                return IndexController.SelectRoleNumber(context, params.number);
            }
            if ('selectScene' === params.sender) {
                return IndexController.SelectScene(context, params.round, params.sceneId);
            }
            if ('votingRound' === params.sender) {
                return IndexController.VotingRound(context, params.round, params.isAgree);
            }
        }

        switch ((context.event.text).toLowerCase()) {
            case 'start':
                return IndexController.ResetGame(context);
            case 'resetgameround':
                return IndexController.resetGameRound(context);
            case 'call db':
                return IndexController.callDB(context);
            case 'call game':
                return IndexController.callGame(context);
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
        } else {
            return querystring.parse(state);
        }
    }

    return url || {};
}