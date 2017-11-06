import Module from '../../../Module';
import routes from './routes';

class ApiModule extends Module {

    getPrefix() {
        return '/api';
    }

    getRoutes() {
        return routes;
    }
}

export default ApiModule;