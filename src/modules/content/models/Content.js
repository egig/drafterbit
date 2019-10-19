const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ContentSchema =  new mongoose.Schema({
    content_type: { type: Schema.Types.ObjectId, ref: 'ContentType' },
    fields: [{
        label: String,
        type_id: Number,
        name: String,
        value: Schema.Types.Mixed
    }]
});

ContentSchema.statics.getCount  = function(contentTypeId, filterObj) {

    let agg = [
        {$match: { content_type: mongoose.Types.ObjectId(contentTypeId)}},
    ];

    if(filterObj) {

        let matchRule = {};
        Object.keys(filterObj).forEach((k) => {
            matchRule['_sfield.name'] = k;
            matchRule['_sfield.value'] = {
                $regex: `.*${filterObj[k]}.*`
            };
        });

        agg.push({$project: { '_sfield': '$fields', fields: 1, content_type: 1 }});
        agg.push({$unwind: '$_sfield'});
        agg.push({$match: matchRule});
    }

    agg.push({$count: 'content_count'});

    return  this.aggregate(agg)
        .exec()
        .then(r => {
            if(!r.length) {
                return 0;
            }
            return r[0].content_counts;
        });
};


ContentSchema.statics.getContents = function(contentTypeId, offset=0, max=10, sortBy, sortDir, searchObj) {

    let sortD = sortDir == 'asc' ? 1 : -1;

    let agg = [
        {$match: { content_type: mongoose.Types.ObjectId(contentTypeId)}},
    ];

    if(searchObj) {

        let matchRule = {};
        Object.keys(searchObj).forEach((k) => {
            matchRule['_sfield.name'] = k;
            matchRule['_sfield.value'] = {
                $regex: `.*${searchObj[k]}.*`
            };
        });

        agg.push({$project: { '_sfield': '$fields', fields: 1, content_type: 1 }});
        agg.push({$unwind: '$_sfield'});
        agg.push({$match: matchRule});
    }

    if(!!sortBy && sortBy !== '_id') {
        agg.push({$project: { '_field': '$fields', fields: 1, content_type: 1 }});
        agg.push({$unwind: '$_field'});
        agg.push({$match: {'_field.name': sortBy }});
        agg.push({$sort: {'_field.value': sortD}});
        agg.push({$project: { content_type: 1, fields:1 }});
    } else {
        agg.push({$sort: {'_id': sortD}});
    }

    agg.push({$skip: offset});
    agg.push({$limit: max});

    return  this.aggregate(agg).exec();
};

/**
 *
 * @param contentId
 * @return {Promise}
 */
ContentSchema.statics.getContent = function(contentId) {
    return this.findOne({_id: contentId});
};


/**
 *
 * @param contentTypeId
 * @param fields
 * @return {Promise}
 */
ContentSchema.statics.createContent = function(contentTypeId, fields) {
    let newContent = new this({
        content_type: contentTypeId,
        fields
    });

    return newContent.save();
};

/**
 *
 * @param contentId
 * @return {Promise}
 */
ContentSchema.statics.deleteContent = function(contentId) {
    return this.deleteOne({_id: contentId});
};

/**
 *
 * @param contentId
 * @param payload
 * @return {Promise}
 */
ContentSchema.statics.updateContent = function(contentId, payload) {
    return this.update({ _id: contentId },payload);
};

module.exports = ContentSchema;