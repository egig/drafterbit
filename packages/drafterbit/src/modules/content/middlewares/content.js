const FieldType = require( '@drafterbit/common/FieldType');
const fieldsToSchema = require( '@drafterbit/common/fieldsToSchema');

/**
 *
 * @param app
 * @param modelName
 * @param schemaObj
 */
function createModel(app, modelName, schemaObj) {
    try {
        app.getDB().model(modelName);
    } catch (error) {
        app.getDB().model(modelName, schemaObj, modelName);
    }
}

module.exports = function contentMiddleware() {
    return function (req, res, next) {

        let contentTypeSlug = req.params['slug'];

        let m = req.app.model('ContentType');

        m.getContentType(contentTypeSlug)
            .then(contentType => {

                if(!contentType) {
                    return res.status('404').send('Not Found');
                }

                // extract other contentTypes
                let relatedContentTypes = [];
                let lookupFields = [];
                contentType.fields.forEach(f => {
                    if ((f.type_id === FieldType.RELATION_TO_MANY) || (f.type_id === FieldType.RELATION_TO_ONE)) {
                        relatedContentTypes.push(f.related_content_type_slug);
                        lookupFields.push(f);
                    }
                });

                let ctPromises = relatedContentTypes.map(slug => {
                    return m.getContentType(slug)
                        .then(ct => {
                            return {
                                slug: ct.slug,
                                schemaObj: fieldsToSchema.getSchema(ct.fields)
                            };
                        });
                });

                return Promise.all(ctPromises)
                    .then(rList => {
                        rList.map(function (ct) {

                            // For all related content type, we try to register model
                            // Unless Mongoose.populate in content list will not work
                            createModel(req.app, ct.slug, ct.schemaObj);
                        });
                    })
                    .then(() => {
                        let schemaObj = fieldsToSchema.getSchema(contentType.fields);
                        // We need to do try catch this
                        // so if new model, we create one
                        createModel(req.app, contentType.slug, schemaObj);

                        req.contentType = contentType;
                        req.lookupFields = lookupFields;

                        next();
                    });

            }).catch(next);
    };
};