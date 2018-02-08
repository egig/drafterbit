require("babel-polyfill");

const app = require('./build/server').default;
const config = require('./config');

let port = config.PORT || 8080;
app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});