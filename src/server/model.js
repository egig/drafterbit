const mongoose = require('mongoose');
const userSchema = require('./schema/userSchema');
const contentTypeSchema = require('./schema/contentTypeSchema');
const contentSchema = require('./schema/contentSchema');
const apiKeySchema = require('./schema/apiKeySchema');


let User = mongoose.model('User', userSchema);
let ContentType = mongoose.model('ContentType', contentTypeSchema);
let Content = mongoose.model('Content', contentSchema);
let ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = {
    User,
    ContentType,
    Content,
    ApiKey
};