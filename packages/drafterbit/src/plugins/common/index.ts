import Plugin from '../../Plugin';
import Application from '../../Application';
const marked = require('marked');

class CommonPlugin extends Plugin {

    constructor(app: Application) {
        super(app);
        
        app.on('boot', function () {
            marked.setOptions({
                renderer: new marked.Renderer(),
                pedantic: false,
                gfm: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
            });

            app.set('marked', marked)
        })
    }
}

export  = CommonPlugin;