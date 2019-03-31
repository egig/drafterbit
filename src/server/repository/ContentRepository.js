const mongoose = require('mongoose');
const BaseRespository = require('./BaseRepository');
const model = require('../model');

class ContentRepository extends BaseRespository {

		getCount(contentTypeId) {
			return new Promise((resolve, reject) => {
				model.Content.count({content_type: contentTypeId}).
				exec(function(err, count) {
					if (err) return reject(err);
					return resolve(count);
				})
			});
		}

    getContents(contentTypeId, offset, max, sortBy, sortDir, searchObj) {

				let sortD = sortDir == "asc" ? 1 : -1;

				let agg = [
					{$match: { content_type: mongoose.Types.ObjectId(contentTypeId)}},
				];

				if(!!searchObj) {

					let matchRule = {};
					Object.keys(searchObj).forEach((k) => {
						matchRule['_sfield.name'] = k;
						matchRule['_sfield.value'] = {
							$regex: `.*${searchObj[k]}.*`
						};
					});

					agg.push({$project: { "_sfield": "$fields", fields: 1, content_type: 1 }});
					agg.push({$unwind: "$_sfield"});
					agg.push({$match: matchRule});
				}

				if(!!sortBy && sortBy !== "_id") {
					agg.push({$project: { "_field": "$fields", fields: 1, content_type: 1 }});
					agg.push({$unwind: "$_field"});
					agg.push({$match: {"_field.name": sortBy }});
					agg.push({$sort: {"_field.value": sortD}});
					agg.push({$project: { content_type: 1, fields:1 }});
				} else {
					agg.push({$sort: {"_id": sortD}});
				}

				agg.push({$skip: offset});
				agg.push({$limit: max});

	    return new Promise((resolve, reject) => {
            model.Content.aggregate(agg)
	            .exec(function(err, contents) {
	            if (err) return reject(err);
	            return resolve(contents);
            })
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