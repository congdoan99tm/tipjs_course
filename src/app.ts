import CustomError from './core/custom.error';
import env from 'dotenv';
env.config();
import express, { Application } from 'express';
const app: Application = express();
import helmet from 'helmet';
import router from './routes/index';
import morgan from 'morgan';
import compression from 'compression';
import productTest from './tests/product.test';
import instanceMongodb from './dbs/init.mongodb';
import inventoryTest from './tests/inventory.test';

// import client  from './loggers/discord.log.v2'
// init middleWare

// client
app.use(morgan('dev')); // log request
app.use(helmet()); // bảo mật, chặn xem framework từ curl ... -include
app.use(compression()); // giảm tải băng thông response.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test pub sub redis
// require('./tests/inventory.test');
inventoryTest.subscribe();
productTest.purchaseProduct('product:001', 10);

// init DB
// require('./dbs/init.mongodb');
instanceMongodb.connect();
// const { checkOverloadDB } = require("./helpers/check.connect");
// checkOverloadDB();
// init routes
// route(app);
app.use('/', router);

// handle error
app.use((req, res, next) => {
  const error = new CustomError('Not Found', 404);
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

export default app;
