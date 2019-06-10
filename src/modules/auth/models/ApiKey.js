const mongoose = require('mongoose');

let ApiKeySchema = mongoose.Schema({
    name: String,
    key: String,
    restriction_type: String,
    restriction_value: String
});


ApiKeySchema.statics.getApiKeys = function () {
    return new Promise((resolve, reject) => {
        this.find(function(err, apiKeys) {
            if (err) return reject(err);
            return resolve(apiKeys);
        });
    });
};

ApiKeySchema.statics.getApiKey = function(apiKeyId) {
    return new Promise((resolve, reject) => {
        this.findOne({_id: apiKeyId}, function(err, apiKey) {
            if (err) return reject(err);
            return resolve(apiKey);
        });
    });
};


ApiKeySchema.statics.getApiKeyByKey = function(key) {
    return new Promise((resolve, reject) => {
        this.findOne({key: key}, function(err, apiKey) {
            if (err) return reject(err);
            return resolve(apiKey);
        });
    });
};


ApiKeySchema.statics.createApiKey = function(name, key, restrictionType, restrictionValue) {
    return new Promise((resolve, reject) => {

        let newApiKey = new this.ApiKey({
            name,
            key,
            restriction_type: restrictionType,
            restriction_value: restrictionValue,
        });

        newApiKey.save((err, newApiKey) => {
            if (err) return reject(err);
            resolve(newApiKey);
        });

    });
};

/**
 *
 * @param apiKeyId
 * @return {Promise}
 */
ApiKeySchema.statics.deleteApiKey = function (apiKeyId) {
    return new Promise((resolve, reject) => {
        this.deleteOne({_id: apiKeyId}, function(err) {
            if (err) return reject(err);
            return resolve(true);
        });
    });
};



/**
 *
 * @param apiKeyId
 * @param payload
 * @return {Promise}
 */
ApiKeySchema.statics.updateApiKey = function(apiKeyId, payload) {
    return new Promise((resolve, reject) => {

        this.update({ _id: apiKeyId }, payload, function(err, res) {
            if (err) return reject(err);
            return resolve(res);
        });
    });
};

module.exports = ApiKeySchema;