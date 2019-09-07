const express = require('express');
const mongoose = require('mongoose');
const ModuleManager = require('./core/ModuleManager');
const boot = require('./boot');

const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);

let mm = new ModuleManager(__dirname, app);
mm.setModulePaths([
    './modules/admin',
    './modules/swagger',
    './modules/auth',
    './modules/user',
    './modules/content',
]);

app.set('module', mm);

app.model = function model(name) {
    return app.get('module').getModel(name);
};

app._mongo_connections = [];


// TODO
app.getDB = function getDB(dbName) {

    if(!app._mongo_connections[dbName]) {
        let config = app.get('config');
        let host = config.get('MONGODB_HOST');
        let port = config.get('MONGODB_PORT');
        let user = config.get('MONGODB_USER');
        let pass = config.get('MONGODB_PASS');

        // TODO add options config here
        let uri = `mongodb+srv://${user}${pass ? `:${pass}` : ''}@${host}${port ? `:${port}` : ''}/${dbName}?retryWrites=true&w=majority`;

        app.get('log').info("DB URI = " + uri);

        let conn = mongoose.createConnection(uri, {
            connectTimeoutMS: 9000,
        }, err => {
            if(err) {
                app.get('log').error("Error create connection for", dbName);
                app.get('log').error(err);
            }
        });

        conn.on('error', err => {
            if(err) {
                app.get('log').error(err);
            }
        });

        app._mongo_connections[dbName] = conn;
    }

    return app._mongo_connections[dbName];
};

app.start = function (configFile) {

    boot(app, configFile);

    let port = 3000;
    app.listen(port, () => console.log(`Listening on port ${port}!`))
};

module.exports = app;