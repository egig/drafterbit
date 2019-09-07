const fieldsToSchema = require( '../fieldsToSchema');
const {FIELD_RELATION_TO_MANY, FIELD_RELATION_TO_ONE} = require( '../fieldTypes');
const ContentTypeSchema  = require('../modules/content/models/ContentType');
const ApiKeySchema  = require('../modules/auth/models/ApiKey');

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


function projectMiddleware() {
    return function (req, res, next) {

        let projectSlug = req.params['project_slug'];
        let db = req.app.getDB(projectSlug);

        // Kick out model
        try {
            db.model('ContentType');
            db.model('ApiKey');
        } catch (error) {
            db.model('ContentType', ContentTypeSchema, '_content_types');
            db.model('ApiKey', ApiKeySchema, '_api_keys');
        }

        if([
                '/',
                '/_swagger_spec.json'
            ].indexOf(req.path) !== -1) {
            return next();
        }

        let apiKey = req.query['api_key'];

        let Model = db.model('ApiKey');

        Model.getApiKeyByKey(apiKey)
            .then(apiK => {

                if(!apiK) {
                    let config = req.app.get('config');
                    // Last chance, check if its the admin api key
                    if(apiKey !== config.get('ADMIN_API_KEY')) {
                        return res.status(403).send('Access Denied');
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            })
            .catch(next);
    };
}

function contentTypeMiddleware() {
    return function (req, res, next) {

        let projectSlug = req.params['project_slug'];
        let contentTypeSlug = req.params['slug'];

        let m = req.app.getDB(projectSlug).model('ContentType');
        m.getContentType(contentTypeSlug)
            .then(contentType => {

                if(!contentType) {
                    return res.status('404').send('Not Found');
                }

                // extract other contentTypes
                let relatedContentTypes = [];
                let relatedContentFields = [];
                let lookupFields = [];
                contentType.fields.forEach(f => {
                    if ((f.type_id === FIELD_RELATION_TO_MANY) || (f.type_id === FIELD_RELATION_TO_ONE)) {
                        relatedContentTypes.push(f.related_content_type_slug);
                        relatedContentFields.push(f.name);
                        lookupFields.push(f)
                    }
                });

                let ctPromises = relatedContentTypes.map(ctId => {
                    return m.getContentType(ctId)
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

                            try {
                                req.app.getDB(projectSlug).model(ct.slug);
                            } catch (error) {
                                req.app.getDB(projectSlug).model(ct.slug, ct.schemaObj);
                            }
                        });
                    })
                    .then(() => {
                        let schemaObj = getSchema(contentType.fields);
                        // We need to do try catch this
                        // so if now model, we create one
                        try {
                            req.app.getDB(projectSlug).model(contentType.slug);
                        } catch (error) {
                            req.app.getDB(projectSlug).model(contentType.slug, schemaObj);
                        }

                        req.contentType = contentType;
                        req.lookupFields = lookupFields;

                        next();
                    });

            }).catch(next);
    };
}


module.exports = {
    projectMiddleware,
    contentTypeMiddleware
};
