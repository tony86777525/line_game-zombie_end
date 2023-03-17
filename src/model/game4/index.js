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
        if (/^new game \d{1,2}$/.test(context.event.payload)) {
            let userCountArray = (context.event.payload).toLowerCase().match(/\d{1,2}/ig);
            let userCount = 0;
            if (userCountArray.length === 1) userCount = userCountArray.shift();

            return IndexController.newGame(context, userCount);
        } else if ('join game' === context.event.payload)
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

        if (context.event.text) {
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
            if (/^start \d{1,2}$/.test((context.event.text).toLowerCase())) {
                let userCountArray = (context.event.text).toLowerCase().match(/\d{1,2}/ig);
                if (userCountArray.length === 1) {
                    return IndexController.ResetGame(context, userCountArray.shift());
                }
            }
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