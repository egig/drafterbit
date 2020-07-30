const drafterbit = require('drafterbit');
const app = new drafterbit({
    plugins: [
        "./my-plugin",
        'drafterbit/plugins/admin',
        'drafterbit/plugins/auth',
        'drafterbit/plugins/common',
        'drafterbit/plugins/content',
    ]
});

module.exports = app;

