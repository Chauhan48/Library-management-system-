const express = require('express');
const cors = require('cors');
const myRouter = require('../routes/index');
const { syntaxValidation } = require('../middleware/syntaxValidation');

module.exports = (app) => {
    app.use(express.json({ limit: '10Mb' }));
    app.use(cors());
    app.use(syntaxValidation)
    app.use(myRouter);
}