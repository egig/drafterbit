const swaggerUi  = require('swagger-ui-express');
const routes  = require('./routes');

module.exports = function (app) {
    app.on('boot', () => {
        app.use('/_swagger', swaggerUi.serve);
    });

    app.on('routing', () => {
        app.use(routes);
    });
};