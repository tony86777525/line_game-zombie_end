const bodyParser = require('body-parser');
const express = require('express');
const { bottender } = require('bottender');
const path = require('path');
const querystring = require('querystring');
const ejs = require('ejs');
const Config = require(`./src/model/game4/config/game`);
const MessageService = require(`${Config.route}/app/services/Message`);
const RoleService = require(`${Config.route}/app/services/Role`);
const SceneService = require(`${Config.route}/app/services/Scene`);

const Message = new MessageService();
const Role = new RoleService();
const Scene = new SceneService();

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

    // server.post('/getUser', (req, res) => {
    //
    // });

    server.get('/liff2', (req, res) => {
        // const params = getParams(req);
        const filename = path.join(`${__dirname}/${Config.route}/resources/view/liff/index.html`);
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
        const filename = path.join(`${__dirname}/${Config.route}/resources/view/liff/role.html`);
        const roles = Role.getLiffRoles();
        const roleUsers = params.data ? JSON.parse(decodeURIComponent(params.data)) : {};

        const data = {
                url: `${Config.route}`,
                roles: roles,
                roleUsers: roleUsers,
                buttonMessage: Message.getStoryHandleContents()
        };
        const options = {};

        ejs.renderFile(filename, data, options, function(err, str) {
            res.send(str);
            if (err) {
                console.log(`error: ${JSON.stringify(err)}`);
            }
        });
    });

    server.get('/liff2/liff2/round', (req, res) => {
        const params = getParams(req);
        const filename = path.join(`${__dirname}/${Config.route}/resources/view/liff/round.html`);
        const roles = Role.getLiffRoles();
        const canSeeAnyoneRoleId = Role.getCanSeeAnyoneRole();
        const canSeeImmunityRoleId = Role.getCanSeeImmunityRole();
        const immunityRoleId = Role.getImmunityRole();
        const roleUsers = params.users ? JSON.parse(decodeURIComponent(params.users)) : {};
        const numberGroupImages = Role.getLiffNumberGroupImages(roleUsers);
        const scenesIds = params.scenes ? JSON.parse(decodeURIComponent(params.scenes)) : {};
        const scenes = Scene.getLiffScenes(scenesIds);
        const data = {
            url: `${Config.route}`,
            roles: roles,
            canSeeAnyoneRoleId: canSeeAnyoneRoleId,
            canSeeImmunityRoleId: canSeeImmunityRoleId,
            immunityRoleId: immunityRoleId,
            roleUsers: roleUsers,
            numberGroupImages: numberGroupImages,
            scenes: scenes,
            buttonMessage: Message.getSelectSceneHandleContents(scenes, params.round)
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