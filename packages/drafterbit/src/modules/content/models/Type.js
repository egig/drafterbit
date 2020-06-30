const mongoose = require('mongoose');


let TypeSchema = new mongoose.Schema({
    name: String,
    slug: { type: String, unique: true },
    description: String,
    is_structured: { type: Boolean, default: false },
    system: { type: Boolean, default: false }, // Content Type is used by system, not user defined
    fields: [{
        related_content_type_slug: String,
        type_id: Number,
        name: String,
        label: String,
        validation_rules: String,
        show_in_list: { type: Boolean, default: true },
        show_in_form: { type: Boolean, default: true },
        unique: { type: Boolean, default: false }
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
 * @param contentTypeId
 * @param field
 * @return {Promise}
 */
TypeSchema.statics.addField = function(contentTypeId, field) {
    return this.updateOne({ _id: contentTypeId }, { $push: { fields: field } });
};


/**
 * @param contentTypeId
 * @return {Promise}
 */
TypeSchema.statics.getContentType = function(contentTypeId) {
    return new Promise((resolve, reject) => {

        let ObjectId = mongoose.Types.ObjectId;
        let condition;
        if(ObjectId.isValid(contentTypeId)) {
            condition = {_id: contentTypeId};
        } else {
            condition = {slug: contentTypeId};
        }

        this.findOne(condition, function(err, contentType) {
            if (err) return reject(err);
            return resolve(contentType);
        });
    });
};


/**
 * @return {Promise}
 */
TypeSchema.statics.getContentTypes = function() {
    return this.find().select(['-__v']).exec();
};


/**
 *
 * @param slug
 * @return {Promise}
 */
TypeSchema.statics.getContentTypeBySlug = function(slug) {
    return this.findOne({slug: slug});
};


/**
 *
 * @param name
 * @param slug
 * @param description
 * @param fields
 * @param system
 * @returns {*}
 */
TypeSchema.statics.createContentType = function(name, slug, description, fields, system = false) {
    let newContentType = new this({
        name,
        slug,
        description,
        fields: fields,
        system
    });

    return newContentType.save();
};


/**
 *
 * @param contentTypeId
 * @return {Promise}
 */
TypeSchema.statics.deleteContentType = function(contentTypeId) {
    return this.deleteOne({_id: contentTypeId});
};


/**
 *
 * @param contentTypeId
 * @param payload
 * @return {Promise}
 */
TypeSchema.statics.updateContentType = function(contentTypeId, payload) {
    return this.updateOne({ _id: contentTypeId }, payload);
};


/**
 *
 * @param contentTypeId
 * @param fieldId
 * @param payload
 * @return {Promise}
 */
TypeSchema.statics.updateContentTypeField = function(contentTypeId, fieldId, payload) {

    let setter = {};
    for (let k of Object.keys(payload)) {
        setter[`fields.$.${k}`] = payload[k];
    }

    return this.updateOne({ _id: contentTypeId, 'fields._id': fieldId }, {
        $set: setter
    });
};

module.exports = TypeSchema;