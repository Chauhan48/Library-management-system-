const bcrypt = require('bcrypt');
const { addNewData, getUserDetails, updateFileData } = require('../service/service');
const { USER_FILE, TOKEN } = require('../../config/config');
const jwt = require('jsonwebtoken');
const { message } = require('../utils/messages');
const { otp } = require('../utils/constants');

exports.signup = async (req, res) => {
    let newUser = req.body;

    let checkExistingUser = getUserDetails(USER_FILE, 'email', newUser.email);
    if (checkExistingUser) {
        return res.status(401).json({ message: message.USER_ALREADY_EXISTS })
    }

    let salt = await bcrypt.genSalt(10);
    newUser.pass = await bcrypt.hash(req.body.pass, salt);

    addNewData(USER_FILE, req.body)
    res.status(201).json({ message: message.USER_ADDED })
}

exports.login = async (req, res) => {
    let user = getUserDetails(USER_FILE, 'email', req.body.email);

    if (!user) {
        return res.status(401).json({ message: message.INVALID_USER })
    }

    if (user.isDeleted) {
        return res.status(401).json({ message: message.USER_DELETED })
    }

    let checkPass = await bcrypt.compare(req.body.pass, user.pass);
    if (!checkPass) {
        return res.status(401).json({ message: message.INVALID_PASS })
    }

    let token = jwt.sign(user.id, TOKEN);
    res.append('authorization', token)
    return res.status(200).json({
        message: message.LOGIN,
        'authorization': token
    })
}

exports.changePassword = async (req, res) => {
    let user = req.user;

    let checkPass = await bcrypt.compare(req.body.pass, user.pass);
    if (checkPass) {
        return res.status(400).json({ message: message.SAME_PASS })
    }

    let salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(req.body.pass, salt);

    updateFileData(USER_FILE, 'email', user);
    return res.status(200).json({ message: message.PASS_UPDATE })

}

exports.forgotPassword = (req, res) => {

    let userId = req.params.id;
    let user = getUserDetails(USER_FILE, 'id', userId);

    if (!user) {
        return res.status(400).json({ message: message.INVALID_ID })
    }

    let checkEmail = getUserDetails(USER_FILE, 'email', req.body.email);
    if(!checkEmail)
    {
        return res.status(400).json({ message: message.INVALID_EMAIL })
    }
    const randomNum = Math.random() * 9000
    const otp = Math.floor(1000 + randomNum)
    res.append('OTP', otp);
    return res.status(200).json({ OTP: otp })
}

exports.createNewPassword = async (req, res) => {
    let otp = req.body.otp;

    if(req.headers['OTP'] != otp)
    {
        return res.status(400).json({message: message.WRONG_OTP});
    }

    let userID = req.params.id;
    let user = getUserDetails(USER_FILE, 'id', userID);

    let salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(req.body.pass, salt);

    updateFileData(USER_FILE, 'email', user);
    return res.status(200).json({message: message.PASS_UPDATE})
}