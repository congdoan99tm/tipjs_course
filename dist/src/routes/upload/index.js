"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_controller_1 = __importDefault(require("../../controllers/upload.controller"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const multer_config_1 = require("../../configs/multer.config");
const router = express_1.default.Router();
// const { authenticationV2 } = require('../../auth/authUtils')
// router.use(authenticationV2)
router.post('/product', (0, asyncHandler_1.default)(upload_controller_1.default.uploadFile));
router.post('/product/thumb', multer_config_1.uploadDisk.single('file'), (0, asyncHandler_1.default)(upload_controller_1.default.uploadFileThumb));
router.post('/product/multiple', multer_config_1.uploadDisk.array('files'), (0, asyncHandler_1.default)(upload_controller_1.default.uploadMultiFile));
router.post('/product/bucket', multer_config_1.uploadMemory.single('file'), (0, asyncHandler_1.default)(upload_controller_1.default.uploadImageFromLocalS3));
exports.default = router;
