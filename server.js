const bodyParser = require('body-parser');
const express = require('express');
const { bottender } = require('bottender');
const path = require('path');
const querystring = require('querystring');
const ejs = require('ejs');

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

    server.get('/liff', (req, res) => {
        const params = getParams(req);
        // const version = params.type || 'index';
        const page = params.type;
        const filename = path.join(__dirname + `/src/liff/${page}.html`);
        const data = {
            params,
            rootPath: process.env.ROOT_PATH
        }
        const options = {};
        ejs.renderFile(filename, data, options, function(err, str) {
            res.send(str);
            if (err) {
                console.log(`error: ${JSON.stringify(err)}`);
            }
        });
        // if ('role' === req.query.type) {
        //     res.sendFile(path.join(`${__dirname}/src/liff/role.html`));
        // } else {
        //     res.sendFile(path.join(`${__dirname}/src/liff/index.html`));
        // }

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