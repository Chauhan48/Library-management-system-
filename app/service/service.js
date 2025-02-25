const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../model');

function checkFileExists(file) {
    let filePath = path.join(dirPath, file);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }
}

function getFileData(file) {
    checkFileExists(file);
    let filePath = path.join(dirPath, file);
    let fileData = fs.readFileSync(filePath, 'utf8');

    return fileData.trim() ? JSON.parse(fileData) : [];
}

function addDataToFIle(file, data) {
    checkFileExists(file);
    let filePath = path.join(dirPath, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

exports.addNewData = (file, data) => {
    let fileData = getFileData(file);
    fileData.push(data);
    addDataToFIle(file, fileData);
}

exports.getUserDetails = (file, field, data) => {
    let fileData = getFileData(file);
    return fileData.find(user => user[`${field}`] == data);
}

exports.updateFileData = (file, field, data) => {
    let fileData = getFileData(file);
    let userIndex = fileData.findIndex(user => user[`${field}`] == data[`${field}`]);
    fileData[userIndex] = { ...data };
    addDataToFIle(file, fileData);
}

exports.displayFileData = (file) => {
    return getFileData(file);
}
