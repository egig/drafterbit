import BaseModule from '../../core/Module';
import authMiddleware from './authMiddleware';

class AuthModule extends BaseModule {
	boot() {
		this.manager.app.use(authMiddleware);
	}
}

module.exports = AuthModule;