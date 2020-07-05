const FieldType = require( '@drafterbit/common/FieldType');
const fieldsToSchema = require( '@drafterbit/common/fieldsToSchema');

/**
 *
 * @param app
 * @param modelName
 * @param schemaObj
 */
function createModel(app, modelName, schemaObj) {
    // TODO figure out the mongoCollectionName
    try {
        app.getDB().model(modelName);
    } catch (error) {
        app.getDB().model(modelName, schemaObj);
    }
}

module.exports = function contentMiddleware() {
    return function (req, res, next) {

        let typeName = req.params['type_name'];

        let m = req.app.model('Type');

        m.getType(typeName)
            .then(type => {

                if(!type) {
                    return res.status('404').send('Not Found');
                }

                // extract child types
                let relatedTypes = [];
                let lookupFields = [];

                let primitiveTypes = FieldType.fieldTypes.map(t => {
                    return t.id
                });

                type.fields.forEach(f => {
                    if (primitiveTypes.indexOf(f.type_name) === -1) {
                        relatedTypes.push(f.type_name);
                        lookupFields.push(f);
                    }
                });

                let ctPromises = relatedTypes.map(typeName => {
                    return m.getType(typeName)
                        .then(ct => {
                            return {
                                name: ct.name,
                                schemaObj: fieldsToSchema.getSchema(ct.fields)
                            };
                        });
                });

                return Promise.all(ctPromises)
                    .then(rList => {
                        rList.map(function (ct) {
                            // For all related content type, we try to register model
                            // Unless Mongoose.populate in content list will not work
                            createModel(req.app, ct.name, ct.schemaObj);
                        });
                    })
                    .then(() => {
                        let schemaObj = fieldsToSchema.getSchema(type.fields);
                        // We need to do try catch this
                        // so if new model, we create one
                        createModel(req.app, type.name, schemaObj);

                        req.type = type;
                        req.lookupFields = lookupFields;

                        next();
                    });

            }).catch(next);
    };
};