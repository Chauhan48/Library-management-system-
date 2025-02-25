const express = require('express');
const { signup, login, changePassword, forgotPassword, createNewPassword } = require('../controller/authController');
const { schemaValidation } = require('../middleware/schemaValidation');
const { authValidation } = require('../middleware/authValidation');
const { signupSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, createNewPasswordSchema } = require('./schema/schema');

const router = express.Router();

router.post('/signup/:id?', schemaValidation(signupSchema), signup);

router.post('/login', schemaValidation(loginSchema), login);

router.put('/change-password', authValidation, schemaValidation(changePasswordSchema), changePassword);

router.put('/forgot-password/:id', schemaValidation(forgotPasswordSchema), forgotPassword)

router.post('/create-new-password', schemaValidation(createNewPasswordSchema),createNewPassword);

module.exports = router