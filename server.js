const app = require('./src/app');
const port = process.env.DEV_APP_PORT || 3056;

const server = app.listen(port, () => {
    console.log('app run on port:', port)
})

process.on('SIGINT', () => {
    const { stopCheckOverloadDB } = require('./src/helpers/check.connect')
    const mongoose = require('mongoose')
    server.close(() => {
        console.log(`app exit on port: ${port}`);
        // stopCheckOverloadDB();
        mongoose.disconnect()
    });
})