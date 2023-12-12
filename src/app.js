require('dotenv').config();
const express = require('express');
const app = express();
const { default: helmet } = require('helmet');
const route = require('./routes/index');
const morgan = require('morgan');
const compression = require('compression');

// init middleWare

app.use(morgan('dev')); // log request
app.use(helmet()); // bảo mật, chặn xem framework từ curl ... -include
app.use(compression()); // giảm tải băng thông response.
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init DB
require('./dbs/init.mongodb');
// const { checkOverloadDB } = require("./helpers/check.connect");
// checkOverloadDB();
// init routes
// route(app);
app.use('/', require('./routes/index'));

// handle error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
