const express = require('express');
const mixin = require('merge-descriptors');
const proto = require('./drafterbit');


function createApplication() {
    const app = express();
    mixin(app, proto, false);
    return app;
}

module.exports = createApplication;