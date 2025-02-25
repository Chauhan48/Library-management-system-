const { USER_FILE } = require('../../config/config')
const { updateFileData, getUserDetails, displayFileData } = require("../service/service");
const { message } = require('../utils/messages');

exports.updateUser = (req, res) => {
    let userData = req.user;

    let userID = req.params.id;
    if (userID != userData.id) {
        return res.status(400).json({ message: message.INVALID_ID })
    }

    if (userData.email != req.body.email) {
        return res.status(400).json({ message: message.USER_EMAIL_UPDATE })
    }

    userData.name = req.body.name

    updateFileData(USER_FILE, 'id', userData);

    return res.status(200).json({ message: message.USER_UPDATE })
}

exports.grantPermission = (req, res) => {

    let userDetails = getUserDetails(USER_FILE, 'id', req.body.id);

    if (userDetails.role != 'sub_admin') {
        return res.status(400).json({ message: message.NOT_SUB_ADMIN })
    }

    userDetails.permission = req.body.permission;
    updateFileData(USER_FILE, 'id', userDetails);

    return res.status(200).json({ message: message.PERMISSION_GRANTED })
}

exports.seeDetails = (req, res) => {
    let userDetails = req.user;

    if(userDetails.role == 'student' || userDetails.role == 'staff')
    {
        return res.status(200).json({userDetails});
    }

    if(userDetails.role == 'sub_admin')
    {
        let staffRecordPermission = req.user.permission.some(it => it == "staff_record");
        let studentRecordPermission = req.user.permission.some(it => it == "student_record");
        if(staffRecordPermission && studentRecordPermission)
        {
            return res.status(400).json({ message: message.DONT_HAVE_ACCESS });
        }
    }

    let fileDetails = displayFileData(USER_FILE)
    return res.status(200).json({fileDetails});
}