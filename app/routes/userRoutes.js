const express = require('express');
const { authValidation } = require('../middleware/authValidation');
const { schemaValidation } = require('../middleware/schemaValidation');
const { updateUserSchema, grantPermissionSchema } = require('./schema/schema');
const { updateUser, grantPermission, seeDetails } = require('../controller/userController');
const { roleValidation } = require('../middleware/roleValidation');

const router = express.Router();

router.post('/update-user/:id', authValidation, schemaValidation(updateUserSchema), updateUser);

router.post('/grant-permission', authValidation, roleValidation, schemaValidation(grantPermissionSchema),grantPermission);

router.post('/see-user-details', authValidation, seeDetails);

module.exports = router