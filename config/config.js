const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    USER_FILE: process.env.USER_FILE,
    BOOK_RECORD_FILE: process.env.BOOK_RECORD_FILE,
    BOOK_ISSUE_FILE: process.env.BOOK_ISSUE_FILE,
    TOKEN: process.env.TOKEN
}