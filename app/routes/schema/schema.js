const joi = require('joi');
const { roles, permissions } = require('../../utils/constants');

const userRoles = Object.keys(roles);
const permission = Object.keys(permissions)

exports.signupSchema = {
    body: joi.object({
        id: joi.number().required(),
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        pass: joi.string().min(3).regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).message('Password should contain atleast one numeric').required(),
        role: joi.string().valid(...userRoles).required()
    }),
    params: joi.object({
        id: joi.number()
    }),
    query: joi.object({
        permission: joi.array().items(joi.string().valid(...permission))
    })
}

exports.loginSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        pass: joi.string().min(3).regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).message('Password should contain atleast one numeric').required()
    })
}

exports.changePasswordSchema = {
    body: joi.object({
        pass: joi.string().min(3).regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).message('Password should contain atleast one numeric').required()
    })
}

exports.forgotPasswordSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        pass: joi.string().min(3).regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).message('Password should contain atleast one numeric').required()
    }),
    params: joi.object({
        id: joi.number().required()
    }),
    query: joi.object({
        name: joi.string(),
    })
}

exports.createNewPasswordSchema = {
    body: joi.object({
        otp: joi.number().required(),
        pass: joi.string().min(3).regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).message('Password should contain atleast one numeric').required()
    }),
    params: joi.object({
        id: joi.number().required()
    })
}

exports.updateUserSchema = {
    body: joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required()
    }),
    params: joi.object({
        id: joi.number().required()
    })
}

exports.grantPermissionSchema = {
    body: joi.object({
        id: joi.number().required(),
        permission: joi.array().items(joi.string().valid(...permission)).required()
    })
}

exports.addBookSchema = {
    body: joi.object({
        bookId: joi.number().required(),
        bookName: joi.string().required(),
        bookAuthor: joi.string().required(),
        available: joi.boolean().required()
    })
}

exports.issueBookSchema = {
    body: joi.object({
        bookId: joi.number().required()
    })
}