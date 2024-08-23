"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_controller_1 = __importDefault(require("../../controllers/access.controller"));
const router = express_1.default.Router();
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const authUtils_1 = require("../../auth/authUtils");
router.post('/shop/login', (0, asyncHandler_1.default)(access_controller_1.default.login));
router.post('/shop/signup', (0, asyncHandler_1.default)(access_controller_1.default.signUp));
// Authentication
router.use(authUtils_1.authenticationV2);
router.post('/shop/logout', (0, asyncHandler_1.default)(access_controller_1.default.logout));
router.post('/shop/handleRefreshToken', (0, asyncHandler_1.default)(access_controller_1.default.handleRefreshToken));
exports.default = router;
