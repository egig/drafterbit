const mongoose = require('mongoose');


let ContentTypeSchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    is_structured: false,
    fields: [{
        related_content_type_slug: String,
        type_id: Number,
        name: String,
        label: String,
        validation_rules: String
    }]
});

/**
 *
 * @param contentTypeId
 * @param field
 * @return {Promise}
 */
ContentTypeSchema.statics.addField = function(contentTypeId, field) {
    return new Promise((resolve, reject) => {

        this.update({ _id: contentTypeId }, { $push: { fields: field } }, function(err, res) {
            if (err) return reject(err);
            return resolve(res);
        });
    });
};


/**
 * @param contentTypeId
 * @return {Promise}
 */
ContentTypeSchema.statics.getContentType = function(contentTypeId) {
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
ContentTypeSchema.statics.getContentTypes = function() {
    return this.find().select(['-__v']).exec();
};


/**
 *
 * @param slug
 * @return {Promise}
 */
ContentTypeSchema.statics.getContentTypeBySlug = function(slug) {
    return this.findOne({slug: slug});
};


/**
 *
 * @param name
 * @param slug
 * @param description
 * @param fields
 * @return {Promise}
 */
ContentTypeSchema.statics.createContentType = function(name, slug, description, fields) {
    let newContentType = new this({
        name,
        slug,
        description,
        fields: fields,
    });

    return newContentType.save();
};


/**
 *
 * @param contentTypeId
 * @return {Promise}
 */
ContentTypeSchema.statics.deleteContentType = function(contentTypeId) {
    return this.deleteOne({_id: contentTypeId});
};


/**
 *
 * @param contentTypeId
 * @param payload
 * @return {Promise}
 */
ContentTypeSchema.statics.updateContentType = function(contentTypeId, payload) {
    return this.updateOne({ _id: contentTypeId }, payload)
};


/**
 *
 * @param contentTypeId
 * @param fieldId
 * @param payload
 * @return {Promise}
 */
ContentTypeSchema.statics.updateContentTypeField = function(contentTypeId, fieldId, payload) {

    let setter = {};
    for (let k of Object.keys(payload)) {
        setter[`fields.$.${k}`] = payload[k];
    }

    return this.updateOne({ _id: contentTypeId, 'fields._id': fieldId }, {
        $set: setter
    });
};

module.exports = ContentTypeSchema;