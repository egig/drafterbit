const express = require('express');
const ModuleManager = require('./core/ModuleManager');
const config = require('./config');
const boot = require('./boot');

const app = express();

let mm = new ModuleManager(__dirname, app);
mm.setModulePaths([
    './modules/swagger',
    './modules/auth',
    './modules/user',
    './modules/content',
]);

app.set('module', mm);

app.model = function (name) {
    return app.get('module').getModel(name);
};

boot(app);

module.exports = app;