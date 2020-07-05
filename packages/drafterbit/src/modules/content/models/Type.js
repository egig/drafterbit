const mongoose = require('mongoose');


let TypeSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    display_text: { type: String, unique: true },
    slug: { type: String, unique: true },
    description: String,
    is_structured: { type: Boolean, default: false },
    has_fields: { type: Boolean, default: false },
    fields: [{
        name: String,
        label: String,
        validation_rules: String,
        show_in_list: { type: Boolean, default: true },
        show_in_form: { type: Boolean, default: true },
        unique: { type: Boolean, default: false },
        type_name: String,
        display_text: String,
        multiple: { type: Boolean, default: false }
    }],
    created_at: Number,
    updated_at: Number,
    deleted_at: Number,
    created_user_id: String,
    updated_user_id: String,
    deleted_user_id: String
});

/**
 *
 * @param typeName
 * @param field
 * @return {Promise}
 */
TypeSchema.statics.addField = function(typeName, field) {
    return this.updateOne({ name: typeName }, { $push: { fields: field } });
};

/**
 *
 * @param typeName
 * @returns {Promise<unknown>}
 */
TypeSchema.statics.getType = function(typeName) {
    return new Promise((resolve, reject) => {

        let ObjectId = mongoose.Types.ObjectId;
        let condition;
        if(ObjectId.isValid(typeName)) {
            condition = {_id: typeName};
        } else {
            condition = {name: typeName};
        }

        this.findOne(condition, function(err, type) {
            if (err) return reject(err);
            return resolve(type);
        });
    });
};


/**
 * @return {Promise}
 */
TypeSchema.statics.getTypes = function() {
    return this.find().select(['-__v']).exec();
};

/**
 *
 * @param name
 * @param slug
 * @param displayText
 * @param description
 * @param has_fields
 * @param fields
 */
TypeSchema.statics.createType = function(name, slug, displayText, description, has_fields, fields = []) {
    let newType = new this({
        name,
        slug,
        display_text: displayText,
        description,
        has_fields,
        fields: fields,
    });

    return newType.save();
};


/**
 *
 * @param typeId
 * @return {Promise}
 */
TypeSchema.statics.deleteType = function(typeId) {
    return this.deleteOne({_id: typeId});
};


/**
 *
 * @param typeId
 * @param payload
 * @return {Promise}
 */
TypeSchema.statics.updateType = function(typeId, payload) {
    return this.updateOne({ _id: typeId }, payload);
};


/**
 *
 * @param typeName
 * @param fieldId
 * @param payload
 * @returns {*}
 */
TypeSchema.statics.updateTypeField = function(typeName, fieldId, payload) {

    let setter = {};
    for (let k of Object.keys(payload)) {
        setter[`fields.$.${k}`] = payload[k];
    }

    return this.updateOne({ name: typeName, 'fields._id': fieldId }, {
        $set: setter
    });
};

module.exports = TypeSchema;