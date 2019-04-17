import BaseRepository from './BaseRepository';
import { ContentType} from '../model';
import mongoose from 'mongoose';

export default class ContentTypeRepository extends BaseRepository {

    /**
     * @param contentTypeId
     * @return {Promise}
     */
    getContentType(contentTypeId) {
        return new Promise((resolve, reject) => {

	        let ObjectId = mongoose.Types.ObjectId;
	        let condition;
	        if(ObjectId.isValid(contentTypeId)) {
	        	condition = {_id: contentTypeId};
	        } else {
		        condition = {slug: contentTypeId};
	        }

            ContentType.findOne(condition, function(err, contentType) {
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
            ContentType.find(function(err, contentTypes) {
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

            ContentType.findOne({slug: slug}, function(err, contentType) {
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

            let newContentType = new ContentType({
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
            ContentType.deleteOne({_id: contentTypeId}, function(err) {
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

            ContentType.update({ _id: contentTypeId }, payload, function(err, res) {
                if (err) return reject(err);
                return resolve(res);
            });
        });
    }
}