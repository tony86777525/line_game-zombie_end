const Game4 = require('./model/game4/index');

module.exports = async function App(context) {
    switch (Number(context.state.lobby_mode)) {
        case 0: // 大廳
            // await Lobby(context);
            break;
        case 1: // 遊戲1
            // await Game1(context);
            break;
        case 2: // 遊戲2
            // await Game2(context);
            break;
        case 3: // 遊戲3
            // await DiceGame(context);
            break;
        case 4: // 遊戲4
            await Game4(context);
            break;
        default:
            //await context.sendText('Welcome to Bottender');
            // await Lobby(context);
            break;
    }
};
