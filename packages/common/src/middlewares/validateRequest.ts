const validate  = require('validate.js');
validate.validators.presence.options = {allowEmpty: false, message: 'is required'};

export default function validateRequest(constraints: any) {
    return async (ctx: any, next: any) => {
        let payload = validate.extend(ctx.params, ctx.query, ctx.request.body);
        let results = validate(payload, constraints);
        if (!results) {
            return await next();
        }

        ctx.status = 400;
        ctx.body = results;
    };
};
