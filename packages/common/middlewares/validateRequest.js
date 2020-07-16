const validate  = require('validate.js');
validate.validators.presence.options = {allowEmpty: false, message: 'is required'};

module.exports = function validateRequest(constraints) {
    return async (ctx, next) => {
        let payload = validate.extend(ctx.params, ctx.query, ctx.request.body);
        let results = validate(payload, constraints);
        if (!results) {
            return await next();
        }

        ctx.status = 400;
        ctx.body = results;
    };
};
