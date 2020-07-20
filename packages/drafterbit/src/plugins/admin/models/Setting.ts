import mongoose from 'mongoose';


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
 */
SettingSchema.statics.getSetting = function(fieldsetName: string) {
    return new Promise((resolve, reject) => {

        let condition = {fieldset_name: fieldsetName};
        this.findOne(condition, function(err:any, setting: Object) {
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
SettingSchema.statics.setSetting = function(fieldsetName: string, payload: Object) {
    return this.updateOne({ fieldset_name: fieldsetName }, payload,  {upsert: true});
};

module.exports = SettingSchema;