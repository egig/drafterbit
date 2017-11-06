import Module from '../../../Module';
import routes from './routes';

class PageModule extends Module {

    getPrefix() {
        return '/page';
    }

    getRoutes() {
        return routes;
    }
}

export default PageModule;