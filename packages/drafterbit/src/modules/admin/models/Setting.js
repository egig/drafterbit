const mongoose = require('mongoose');


let SettingSchema = new mongoose.Schema({
    fieldset_name: {type: String, unique: true},
    created_at: Number,
    updated_at: Number,
    deleted_at: Number,
    created_user_id: String,
    updated_user_id: String,
    deleted_user_id: String
}, {strict: false});


/**
 *
 * @param fieldsetName
 * @returns {Promise<unknown>}
 */
SettingSchema.statics.getSetting = function(fieldsetName) {
    return new Promise((resolve, reject) => {

        let condition = {fieldset_name: fieldsetName};
        this.findOne(condition, function(err, setting) {
            if (err) return reject(err);
            return resolve(setting);
        });
    });
};


/**
 * @return {Promise}
 */
SettingSchema.statics.getSettings = function() {
    return this.find().select(['-__v']).exec();
};


/**
 *
 * @param fieldsetName
 * @param payload
 * @returns {*}
 */
SettingSchema.statics.setSetting = function(fieldsetName, payload) {
    return this.updateOne({ fieldset_name: fieldsetName }, payload,  {upsert: true});
};

module.exports = SettingSchema;