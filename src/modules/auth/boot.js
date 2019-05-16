import authMiddleware from './authMiddleware';

export default function boot(app) {

	app.use(authMiddleware);

}