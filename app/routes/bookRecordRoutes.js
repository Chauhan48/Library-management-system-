const express = require('express');
const { authValidation } = require('../middleware/authValidation');
const { allBooks, addBook, issueBook, returnBook, seeIssuedBooks } = require('../controller/bookRecordController');
const { roleValidation } = require('../middleware/roleValidation');
const { schemaValidation } = require('../middleware/schemaValidation');
const { addBookSchema, issueBookSchema } = require('./schema/schema');

const router = express.Router();

router.get('/display-book', authValidation, allBooks);

router.post('/add-book', authValidation, roleValidation, schemaValidation(addBookSchema), addBook);

router.post('/issue-book', authValidation, schemaValidation(issueBookSchema), issueBook);

router.post('/return-book', authValidation, roleValidation, returnBook);

router.post('/display-issued-books', authValidation, roleValidation, seeIssuedBooks);

module.exports = router;