function checkValidations(schema, data) {
    const { error, value } = schema.validate(data);

    if (error) {
        throw new Error(error.details[0].message);
    }
}

exports.schemaValidation = (schema) => {
    return (req, res, next) => {

        try {
            if (schema.body) {
                checkValidations(schema.body, req.body);
            }
            if (schema.params) {
                checkValidations(schema.params, req.params);
            }
            if (schema.query) {
                checkValidations(schema.query, req.query);
            }
            next();
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}