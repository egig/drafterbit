const BaseRespository = require('./BaseRepository');
const model = require('../model');

class ContentTypeRepository extends BaseRespository {

    /**
     * @param contentTypeId
     * @return {Promise}
     */
    getContentType(contentTypeId) {
        return new Promise((resolve, reject) => {
            model.ContentType.findOne({_id: contentTypeId}, function(err, contentType) {
                if (err) return reject(err);
                return resolve(contentType);
            });
        });
    }


    /**
     * @return {Promise}
     */
    getContentTypes() {
        return new Promise((resolve, reject) => {
            model.ContentType.find(function(err, contentTypes) {
                if (err) return reject(err);
                return resolve(contentTypes);
            });
        });
    }


    /**
     *
     * @param slug
     * @return {Promise}
     */
    getContentTypeBySlug(slug) {
        return new Promise((resolve, reject) => {

            model.ContentType.findOne({slug: slug}, function(err, contentType) {
                if (err) return reject(err);
                return resolve(contentType);
            });

        });
    }


    /**
     *
     * @param name
     * @param slug
     * @param description
     * @param fields
     * @return {Promise}
     */
    createContentType(name, slug, description, fields) {

        return new Promise((resolve, reject) => {

            let newContentType = new model.ContentType({
                name,
                slug,
                description,
                fields: fields,
            });

            newContentType.save((err, newContentType) => {
                if (err) return reject(err);
                resolve(newContentType);
            });

        });
    }


    /**
     *
     * @param contentTypeId
     * @return {Promise}
     */
    deleteContentType(contentTypeId) {
        return new Promise((resolve, reject) => {
            model.ContentType.deleteOne({_id: contentTypeId}, function(err) {
                if (err) return reject(err);
                return resolve(true);
            });
        });
    }


    /**
     *
     * @param contentTypeId
     * @param payload
     * @return {Promise}
     */
    updateContentType(contentTypeId, payload) {
        return new Promise((resolve, reject) => {

            model.ContentType.update({ _id: contentTypeId }, payload, function(err, res) {
                if (err) return reject(err);
                return resolve(res);
            });
        });
    }
}

module.exports = ContentTypeRepository;