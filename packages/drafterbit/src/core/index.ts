import Plugin from '../Plugin';
import Application from "../Application";
const marked = require('marked');

class CorePlugin extends Plugin {

    onBoot(app: Application) {
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
    }
}

export = CorePlugin;