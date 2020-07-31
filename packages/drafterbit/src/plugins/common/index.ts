import Plugin from '../../Plugin';
import Application from '../../Application';
const install = require('./install');

class CommonPlugin extends Plugin {
    install(app: Application) {
        return install(app)
    }
}

export  = CommonPlugin;