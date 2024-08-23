"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = __importDefault(require("../../controllers/comment.controller"));
const router = express_1.default.Router();
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const authUtils_1 = require("../../auth/authUtils");
// Authentication
router.use(authUtils_1.authenticationV2);
router.post('', (0, asyncHandler_1.default)(comment_controller_1.default.createComment));
router.get('', (0, asyncHandler_1.default)(comment_controller_1.default.getCommentsByParentId));
exports.default = router;
