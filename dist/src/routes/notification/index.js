"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = __importDefault(require("../../controllers/notification.controller"));
const router = express_1.default.Router();
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const authUtils_1 = require("../../auth/authUtils");
// Here not login
// Authentication
router.use(authUtils_1.authenticationV2);
router.get('', (0, asyncHandler_1.default)(notification_controller_1.default.listNotiByUser));
exports.default = router;
