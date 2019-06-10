const BaseModule = require('../../core/Module');
const swaggerUi  = require('swagger-ui-express');

class SwaggerModule extends BaseModule {

    boot() {
        this.manager.app.use(
            '/_swagger',
            swaggerUi.serve
        );
    }
}

module.exports = SwaggerModule;