var app = require('./build/server');
var config = require('./config');
var port = config.PORT || 8080;
app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");
});
