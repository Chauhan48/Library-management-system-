const { message } = require("../utils/messages");

exports.roleValidation = (req, res, next) => {
    let user = req.user;

    if (user.role == 'student' || user.role == 'staff') {
        return res.status(401).json({ message: message.NOT_ALLOWED });
    }

    next();
}