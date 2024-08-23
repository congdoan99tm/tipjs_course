"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../core/success.response");
const upload_service_1 = require("../services/upload.service");
const error_response_1 = require("../core/error.response");
class UploadController {
    constructor() {
        this.uploadFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'upload successfully uploaded',
                metadata: yield (0, upload_service_1.uploadImageFromUrl)(),
            }).send(res);
        });
        this.uploadFileThumb = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { file } = req;
            if (!file) {
                throw new error_response_1.BadRequestError('File missing');
            }
            new success_response_1.SuccessResponse({
                message: 'upload successfully uploaded',
                metadata: yield (0, upload_service_1.uploadImageFromLocal)({
                    path: file.path,
                }),
            }).send(res);
        });
        this.uploadMultiFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { files } = req;
            if (!files) {
                throw new error_response_1.BadRequestError('File missing');
            }
            new success_response_1.SuccessResponse({
                message: 'upload successfully uploaded',
                metadata: yield (0, upload_service_1.uploadMultiImageFromLocal)({
                    files,
                }),
            }).send(res);
        });
        this.uploadImageFromLocalS3 = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { file } = req;
            if (!file) {
                throw new error_response_1.BadRequestError('File missing');
            }
            new success_response_1.SuccessResponse({
                message: 'upload successfully uploaded use S3Client',
                metadata: yield (0, upload_service_1.uploadImageFromLocalS3)({
                    file,
                }),
            }).send(res);
        });
    }
}
exports.default = new UploadController();
