const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useUnifiedTopology', true);

module.exports = function createMongooseConn(app, protocol, dbName, host, user, pass, port) {

    if(user || pass) {
        host = `@${host}`;
    }

    pass = !!pass ? `:${pass}` : '';
    port = !!port ? `:${port}` : '';

    let uri = `${protocol}://${user}${pass}${host}${port}/${dbName}?retryWrites=true&w=majority`;

    app.get('log').info('DB URI = ' + uri);
    let conn = mongoose.createConnection(uri, {
        connectTimeoutMS: 9000,
    }, err => {
        if(err) {
            app.get('log').error('Error create connection for', dbName);
            app.get('log').error(err);
        }
    });

    conn.on('error', err => {
        if(err) {
            app.get('log').error(err);
        }
    });

    return conn;
};