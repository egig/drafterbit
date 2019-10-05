const {FIELD_RELATION_TO_MANY, FIELD_RELATION_TO_ONE} = require( '../../../fieldTypes');
const getDbName  = require('../../../getDbName');
const fieldsToSchema = require( '../../../fieldsToSchema');

function getSchema(fields, dbName) {
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
 * @param dbName
 * @param modelName
 * @param schemaObj
 */
function createModel(app, dbName, modelName, schemaObj) {
    try {
        app.getDB(dbName).model(modelName);
    } catch (error) {
        app.getDB(dbName).model(modelName, schemaObj, modelName);
    }
}

module.exports = function contentMiddleware() {
    return function (req, res, next) {

        let dbName = getDbName(req);
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
                                schemaObj: getSchema(ct.fields, dbName)
                            };
                        });
                });

                return Promise.all(ctPromises)
                    .then(rList => {
                        rList.map(function (ct) {
                            createModel(req.app, dbName, ct.slug, ct.schemaObj);
                        });
                    })
                    .then(() => {
                        let schemaObj = getSchema(contentType.fields, dbName);
                        // We need to do try catch this
                        // so if now model, we create one
                        createModel(req.app, dbName, contentType.slug, schemaObj);

                        req.contentType = contentType;
                        req.lookupFields = lookupFields;

                        next();
                    });

            }).catch(next);
    };
};