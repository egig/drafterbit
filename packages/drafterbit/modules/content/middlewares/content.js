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
    return async function(typeName, ctx, next) {

        try {

            let m = ctx.app.model('Type');
            let type = await m.getType(typeName);

            if(!type) {
                ctx.status = 404;
                ctx.body = 'Not Found';
                return await next();
            }

            let relatedTypes = [];
            let lookupFields = [];

            type.fields.forEach(f => {
                if (FieldType.primitives().indexOf(f.type_name) === -1) {
                    relatedTypes.push(f.type_name);
                    lookupFields.push(f);
                }
            });


            let typeSchemaListPromises = relatedTypes.map(async typeName => {
                let ct =  await m.getType(typeName);
                return {
                    name: ct.name,
                    schemaObj: fieldsToSchema.getSchema(ct.fields)
                };
            });

            let typeSchemaList = await Promise.all(typeSchemaListPromises);
            typeSchemaList.map(ct => {
                createModel(ctx.app, ct.name, ct.schemaObj);
            });


            let schemaObj = fieldsToSchema.getSchema(type.fields);
            createModel(ctx.app, type.name, schemaObj);

            ctx.state.type = type;
            ctx.state.lookupFields = lookupFields;
            await next();

        } catch (e) {
            console.log(e);
            // await next(e)
        }
    };
};