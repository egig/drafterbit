const drafterbit = require('drafterbit/drafterbit');

const app = new drafterbit();
app.modules = [
    "./my-module",
    'drafterbit/modules/admin',
    'drafterbit/modules/auth',
    'drafterbit/modules/common',
    'drafterbit/modules/content',
];

app.boot(__dirname);
app.routing();
app.emit('pre-start');

app.listen(3000, () => {
    console.log("app running on port 3000")
});