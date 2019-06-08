import BaseModule from '../../core/Module';
import swaggerUi from 'swagger-ui-express';

class SwaggerModule extends BaseModule {

	boot() {
		this.manager.app.use(
			'/_swagger',
			swaggerUi.serve
		);
	}
}

module.exports = SwaggerModule;