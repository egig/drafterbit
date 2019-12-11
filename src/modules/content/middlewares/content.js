const {FIELD_RELATION_TO_MANY, FIELD_RELATION_TO_ONE} = require( '../../../fieldTypes');
const fieldsToSchema = require( '../../../fieldsToSchema');

function getSchema(fields) {
    let fieldsObj = {};
    fields.forEach(f => {

        if (f.type_id === FIELD_RELATION_TO_MANY) {
            fieldsObj[f.name] = [{
                type: f.type_id,
                ref: f.related_content_type_slug
            }];

        } else if (f.type_id === FIELD_RELATION_TO_ONE) {

            fieldsObj[f.name] = {
                type: f.type_id,
                ref: f.related_content_type_slug
            };

        } else {
            fieldsObj[f.name] = {
                type: f.type_id
            };
        }
    });

    return fieldsToSchema.convert(fieldsObj);
}

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
                    if ((f.type_id === FIELD_RELATION_TO_MANY) || (f.type_id === FIELD_RELATION_TO_ONE)) {
                        relatedContentTypes.push(f.related_content_type_slug);
                        lookupFields.push(f);
                    }
                });

                let ctPromises = relatedContentTypes.map(slug => {
                    return m.getContentType(slug)
                        .then(ct => {
                            return {
                                slug: ct.slug,
                                schemaObj: getSchema(ct.fields)
                            };
                        });
                });

                return Promise.all(ctPromises)
                    .then(rList => {
                        rList.map(function (ct) {
                            createModel(req.app, ct.slug, ct.schemaObj);
                        });
                    })
                    .then(() => {
                        let schemaObj = getSchema(contentType.fields);
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