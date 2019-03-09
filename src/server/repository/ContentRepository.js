const BaseRespository = require('./BaseRepository');
const model = require('../model');

class ContentRepository extends BaseRespository {

    getContents(contentTypeId) {
        return new Promise((resolve, reject) => {
            model.Content.find({content_type: contentTypeId}, function(err, contents) {
                if (err) return reject(err);
                return resolve(contents);
            });
        });
    }

    /**
     *
     * @param contentId
     * @return {Promise}
     */
    getContent(contentId) {
        return new Promise((resolve, reject) => {
            model.Content.findOne({_id: contentId}, function (err, content) {
                if (err) return reject(err);
                return resolve(content);
            });
        });
    }

    /**
     *
     * @param contentTypeId
     * @param fields
     * @return {Promise}
     */
    createContent(contentTypeId, fields) {

        return new Promise((resolve, reject) => {

            let newContent = new model.Content({
                content_type: contentTypeId,
                fields
            });

            newContent.save((err, newContent) => {
                if (err) return reject(err);
                resolve(newContent);
            });

        });
    }

    /**
     *
     * @param contentId
     * @return {Promise}
     */
    deleteContent(contentId) {

        return new Promise((resolve, reject) => {
            model.Content.deleteOne({_id: contentId}, function(err) {
                if (err) return reject(err);
                return resolve(true);
            });
        });
    }

    /**
     *
     * @param contentId
     * @param payload
     * @return {Promise}
     */
    updateContent(contentId, payload) {
        return new Promise((resolve, reject) => {

            model.Content.update({ _id: contentId },payload,function(err, res) {
                if (err) return reject(err);
                return resolve(res);
            });
        });
    }
}

module.exports = ContentRepository;