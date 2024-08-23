"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = __importDefault(require("../../controllers/cart.controller"));
const router = express_1.default.Router();
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
router.post('', (0, asyncHandler_1.default)(cart_controller_1.default.addToCart));
router.delete('', (0, asyncHandler_1.default)(cart_controller_1.default.delete));
router.post('/update', (0, asyncHandler_1.default)(cart_controller_1.default.update));
router.get('', (0, asyncHandler_1.default)(cart_controller_1.default.listToCart));
exports.default = router;
