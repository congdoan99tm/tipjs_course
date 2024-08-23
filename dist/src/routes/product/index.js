"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = __importDefault(require("../../controllers/product.controller"));
const router = express_1.default.Router();
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const authUtils_1 = require("../../auth/authUtils");
router.get('/search/:keySearch', (0, asyncHandler_1.default)(product_controller_1.default.getListSearchProduct));
router.get('', (0, asyncHandler_1.default)(product_controller_1.default.findAllProduct));
router.get('/:product_id', (0, asyncHandler_1.default)(product_controller_1.default.findProduct));
// Authentication
router.use(authUtils_1.authenticationV2);
router.post('', (0, asyncHandler_1.default)(product_controller_1.default.createProduct));
router.patch('/:productId', (0, asyncHandler_1.default)(product_controller_1.default.updateProduct));
router.post('/publish/:id', (0, asyncHandler_1.default)(product_controller_1.default.publishProductByShop));
router.post('/unpublish/:id', (0, asyncHandler_1.default)(product_controller_1.default.unPublishProductByShop));
// Query
router.get('/drafts/all', (0, asyncHandler_1.default)(product_controller_1.default.getAllDraftsForShop));
router.get('/published/all', (0, asyncHandler_1.default)(product_controller_1.default.getAllPublishForShop));
exports.default = router;
