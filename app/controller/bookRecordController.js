const { BOOK_RECORD_FILE, BOOK_ISSUE_FILE, USER_FILE } = require("../../config/config")
const { displayFileData, addNewData, updateFileData, getUserDetails } = require("../service/service");
const { message } = require("../utils/messages");

exports.allBooks = (req, res) => {
    let bookRecord = displayFileData(BOOK_RECORD_FILE);
    return res.status(200).json(bookRecord);
}

exports.addBook = (req, res) => {
    let bookRecord = displayFileData(BOOK_RECORD_FILE);
    if (req.user.role == 'sub_admin') {
        let permission = req.user.permission.some(it => it == "book_record");
        if (!permission) {
            return res.status(400).json({ message: message.DONT_HAVE_ACCESS })
        }
    }
    
    let checkExistingBookId = bookRecord.some(book => book.bookId == req.body.bookId);
    if (checkExistingBookId) {
        return res.status(400).json({ message: message.EXISTING_BOOK_ID })
    }

    addNewData(BOOK_RECORD_FILE, req.body);
    return res.status(201).json({ message: message.BOOK_ADDED });
}

exports.issueBook = (req, res) => {
    let userDetails = req.user;

    if (userDetails.role != 'student') {
        return res.status(400).json({ message: message.ONLY_STUDENT_ISSUE_BOOK });
    }

    let bookRecord = displayFileData(BOOK_RECORD_FILE);
    let checkBookAvailability = bookRecord.find(book => book.bookId == req.body.bookId);
    if (!checkBookAvailability.available) {
        return res.status(400).json({ message: message.BOOK_NOT_AVAILABLE })
    }

    let issueBook = {};
    issueBook.studentId = userDetails.id;
    issueBook.bookId = req.body.bookId;
    issueBook.issuedBookId = userDetails.id + req.body.bookId;
    issueBook.issueBookTime = Date.now();

    addNewData(BOOK_ISSUE_FILE, issueBook);
    checkBookAvailability.available = false;
    updateFileData(BOOK_RECORD_FILE, 'bookId', checkBookAvailability);
    return res.status(200).json({ message: message.BOOK_ISSUE_SUCCESS })
}

exports.returnBook = (req, res) => {
    let bookIssueFileData = displayFileData(BOOK_ISSUE_FILE);
    let userDetails = getUserDetails(USER_FILE, 'id', req.body.studentId);

    if (!userDetails) {
        return res.status(400).json({ message: message.INVALID_USER })
    }

    if (req.user.role == 'sub_admin') {
        if (req.user.permission != "book_record") {
            return res.status(400).json({ message: message.DONT_HAVE_ACCESS })
        }
    }

    let checkIfIssuedBook = bookIssueFileData.some(book => book.studentId == userDetails.id);
    if (!checkIfIssuedBook) {
        return res.status(200).json({ message: message.BOOK_NOT_ISSUED });
    }

    let issueBookDetails = getUserDetails(BOOK_ISSUE_FILE, 'studentId', userDetails.id);
    issueBookDetails.returned = true;
    let bookId = issueBookDetails.bookId;
    updateFileData(BOOK_ISSUE_FILE, 'bookId', issueBookDetails);
    let bookRecords = displayFileData(BOOK_RECORD_FILE);
    let book = bookRecords.find(it => it.bookId == bookId);
    book.available = true;
    updateFileData(BOOK_RECORD_FILE, 'bookId', bookRecords);

    let fine = 0;
    const currentTime = Date.now();
    const differenceInMilliseconds = currentTime - issueBookDetails.issueBookTime;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    if (differenceInDays > 7) {
        fine += (differenceInDays - 7) * 10;
        return res.status(401).json({ message: message.LATE_FINE, Fine: fine })
    }

    return res.status(200).json({ message: message.BOOK_RETURNED_SUCCESS })

}

exports.seeIssuedBooks = (req, res) => {
    let data = displayFileData(BOOK_ISSUE_FILE);
    return res.status(200).json({data});
}