"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../auth/checkAuth");
const router = express_1.default.Router();
const upload_1 = __importDefault(require("./upload"));
const checkout_1 = __importDefault(require("./checkout"));
const profile_1 = __importDefault(require("./profile"));
const discount_1 = __importDefault(require("./discount"));
const inventory_1 = __importDefault(require("./inventory"));
const cart_1 = __importDefault(require("./cart"));
const product_1 = __importDefault(require("./product"));
const comment_1 = __importDefault(require("./comment"));
const notification_1 = __importDefault(require("./notification"));
const access_1 = __importDefault(require("./access"));
const api_key_1 = __importDefault(require("./api_key"));
// import { pushToLogDiscord }  from '../middleware/index'
// add log to discord
// router.use(pushToLogDiscord)
// check api key
router.use('/v1/api/api-key', api_key_1.default);
router.use(checkAuth_1.apiKey);
// check permission
router.use((0, checkAuth_1.permission)('0000'));
router.use('/v1/api/checkout', checkout_1.default);
router.use('/v1/api/profile', profile_1.default);
router.use('/v1/api/discount', discount_1.default);
router.use('/v1/api/inventory', inventory_1.default);
router.use('/v1/api/cart', cart_1.default);
router.use('/v1/api/product', product_1.default);
router.use('/v1/api/upload', upload_1.default);
router.use('/v1/api/comment', comment_1.default);
router.use('/v1/api/notification', notification_1.default);
router.use('/v1/api', access_1.default);
exports.default = router;
