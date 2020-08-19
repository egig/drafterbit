const path = require('path');
const Plugin = require('drafterbit/dist/Plugin');

class MyPlugin extends Plugin {

    getAdminClientSideEntry() {
        return path.join(this.getPath(),'/client-side/src/index.js')
    }
}

module.exports = MyPlugin;