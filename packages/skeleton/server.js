const drafterbit = require('../drafterbit/drafterbit');

const app = new drafterbit();
app.modules = [
    '../drafterbit/modules/auth',
    '../drafterbit/modules/common',
    '../drafterbit/modules/admin',
    '../drafterbit/modules/content',
];

app.boot({ROOT_DIR: __dirname });
app.routing();
app.emit('pre-start');

app.listen(3000, () => {
    console.log("app running on port 3000")
});