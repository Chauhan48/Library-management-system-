const { message } = require("../utils/messages");

exports.syntaxValidation = (err, req, res, next) => {
    if(err instanceof SyntaxError)
    {
        return res.status(400).json({message: message.SYNTAX_MESSAGE});
    }

    next()
}