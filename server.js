const express = require('express');
const { PORT } = require('./config/config');

const app = express();

async function serverStarted() {
    await require('./app/startup/startup')(app)
}

serverStarted().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}).catch(() => {
    console.log(`Error`)
})