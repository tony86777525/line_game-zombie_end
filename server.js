const bodyParser = require('body-parser');
const express = require('express');
const { bottender } = require('bottender');
const path = require('path');
const querystring = require('querystring');
const ejs = require('ejs');
const gameConfig = require('./src/config/game');
const lang = require(`./resources/lang/${process.env.ROOT_LANG}/index`);
const messageService = require('./src/app/services/message');

const app = bottender({
    dev: process.env.NODE_ENV !== 'production',
});

const port = Number(process.env.PORT) || 5000;

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    server.use(express.static('public'));

    server.use(
        bodyParser.json({
            verify: (req, _, buf) => {
                req.rawBody = buf.toString();
            },
        })
    );

    server.get('/send-id', (req, res) => {
        res.json({ id: process.env.LINE_LIFF_ID });
    });

    server.get('/liff2', (req, res) => {
        // const params = getParams(req);
        const filename = path.join(__dirname + `/resources/view/liff/index.html`);
        const data = {}, options = {};

        ejs.renderFile(filename, data, options, function(err, str) {
            res.send(str);
            if (err) {
                console.log(`error: ${JSON.stringify(err)}`);
            }
        });
    });
    server.get('/liff2/liff2/role', (req, res) => {
        const params = getParams(req);
        // const version = params.type || 'index';
        const page = params.type;
        const filename = path.join(__dirname + `/resources/view/liff/role.html`);

        const roles = gameConfig.role;
        const role = params.role;
        const card = roles.card[role];

        const data = {
            role: {
                name: lang.roleCard[role],
                image: card.image,
                type: lang.roleType[card.type],
                power: lang.rolePower[card.power],
                winner: lang.roleWinner[card.winner],
            },
            message: {
                story: (new messageService).getStoryHandleContents()
            }
        };
        const options = {};

        ejs.renderFile(filename, data, options, function(err, str) {
            res.send(str);
            if (err) {
                console.log(`error: ${JSON.stringify(err)}`);
            }
        });
    });

    // delegate other requests to bottender
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});

function getParams(req) {
    const state = req.query['liff.state'];
    if (state) {
        const array = state.split('?');
        if (array.length == 2) {
            return querystring.parse(array[1]);
        }
    }

    return req.query || {};
}