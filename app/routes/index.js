const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const bookRecordRoutes = require('./bookRecordRoutes')

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/user', userRoutes);

router.use('/library', bookRecordRoutes);

module.exports = router;