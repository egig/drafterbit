const validateRequest = schema => (req, res, next) => {

    req.check(schema);

    req.getValidationResult()
        .then(errors => {
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.mapped() });
            }

            next();
        });
};

module.exports = validateRequest;
