import swaggerUi from 'swagger-ui-express';

export default function boot(app) {

	app.use(
		'/_swagger',
		swaggerUi.serve
	);

}