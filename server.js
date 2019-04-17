const app = require('./build/server');

const config = require('./config');
const port = config.PORT || 8080;
app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");
});
