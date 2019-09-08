const routes  = require('./routes');
const projectMiddleware  = require('./middlewares/project');

module.exports = function (app) {

    app.on('boot', () => {
        app.use(projectMiddleware());
    });

    app.on('routing', () => {
        app.use(routes);
    });
};