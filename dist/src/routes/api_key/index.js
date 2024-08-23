"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const apiKey_controller_1 = __importDefault(require("../../controllers/apiKey.controller"));
router.post('/create', (0, asyncHandler_1.default)(apiKey_controller_1.default.create));
exports.default = router;
