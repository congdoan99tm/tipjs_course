"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_1 = __importDefault(require("./core/custom.error"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const helmet_1 = __importDefault(require("helmet"));
const index_1 = __importDefault(require("./routes/index"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const product_test_1 = __importDefault(require("./tests/product.test"));
const init_mongodb_1 = __importDefault(require("./dbs/init.mongodb"));
const inventory_test_1 = __importDefault(require("./tests/inventory.test"));
// import client  from './loggers/discord.log.v2'
// init middleWare
// client
app.use((0, morgan_1.default)('dev')); // log request
app.use((0, helmet_1.default)()); // bảo mật, chặn xem framework từ curl ... -include
app.use((0, compression_1.default)()); // giảm tải băng thông response.
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// test pub sub redis
// require('./tests/inventory.test');
inventory_test_1.default.subscribe();
product_test_1.default.purchaseProduct('product:001', 10);
// init DB
// require('./dbs/init.mongodb');
init_mongodb_1.default.connect();
// const { checkOverloadDB } = require("./helpers/check.connect");
// checkOverloadDB();
// init routes
// route(app);
app.use('/', index_1.default);
// handle error
app.use((req, res, next) => {
    const error = new custom_error_1.default('Not Found', 404);
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
exports.default = app;
