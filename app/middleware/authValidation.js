const jwt = require('jsonwebtoken')
const { TOKEN, USER_FILE } = require('../../config/config');
const { getUserDetails } = require('../service/service');
const { message } = require('../utils/messages');

exports.authValidation = (req, res, next) => {
    let userId;
    let userDetails;
    try {
        userId = jwt.verify(req.headers['authorization'], TOKEN);
        userDetails = getUserDetails(USER_FILE, 'id', userId);

        if (Object.hasOwn(userDetails, 'isDeleted')) {

            if (userDetails.isDeleted) {
                return res.status(401).json({ message: message.USER_DELETED })
            }
        }

    } catch {
        return res.status(401).json({ message: message.INVALID_TOKEN });
    }

    req.user = userDetails;
    next();
}