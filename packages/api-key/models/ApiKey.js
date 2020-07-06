const mongoose = require('mongoose');

let ApiKeySchema = mongoose.Schema({
    name: String,
    key: String,
    restriction_type: String,
    restriction_value: String
});


ApiKeySchema.statics.getApiKeys = function () {
    return this.find();
};

ApiKeySchema.statics.getApiKey = function(apiKeyId) {
    return this.findOne({_id: apiKeyId});
};

ApiKeySchema.statics.getApiKeyByKey = function(key) {
    return this.findOne({key: key});
};


ApiKeySchema.statics.createApiKey = function(name, key, restrictionType, restrictionValue) {
    
    let newApiKey = new this({
        name,
        key,
        restriction_type: restrictionType,
        restriction_value: restrictionValue,
    });

    newApiKey.save();
    return newApiKey;
};

/**
 *
 * @param apiKeyId
 * @return {Promise}
 */
ApiKeySchema.statics.deleteApiKey = function (apiKeyId) {
    return this.deleteOne({_id: apiKeyId});
};



/**
 *
 * @param apiKeyId
 * @param payload
 * @return {Promise}
 */
ApiKeySchema.statics.updateApiKey = function(apiKeyId, payload) {
    return this.updateOne({ _id: apiKeyId }, payload);
};

module.exports = ApiKeySchema;