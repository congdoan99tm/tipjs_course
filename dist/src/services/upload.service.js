"use strict";
// 1. Upload from url image
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageFromLocalS3 = exports.uploadMultiImageFromLocal = exports.uploadImageFromLocal = exports.uploadImageFromUrl = void 0;
const cloudinary_config_1 = __importDefault(require("../configs/cloudinary.config"));
const s3_config_1 = require("../configs/s3.config");
const crypto_1 = __importDefault(require("crypto"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const randomImageName = () => crypto_1.default.randomBytes(16).toString('hex');
const urlImagePublic = 'https://d2my2g1tccak51.cloudfront.net';
const uploadImageFromLocalS3 = (_a) => __awaiter(void 0, [_a], void 0, function* ({ file }) {
    try {
        const imageName = randomImageName();
        const command = new s3_config_1.PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg',
        });
        const signedUrl = new s3_config_1.GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        });
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3_config_1.s3, signedUrl, { expiresIn: 3600 });
        const url2 = `${urlImagePublic}/${command.input.Key}`;
        const result = yield s3_config_1.s3.send(command);
        return {
            image_url: url2,
            shopId: 8409,
            thumb_url: yield cloudinary_config_1.default.url(result['public_id'], {
                height: 100,
                width: 100,
                format: 'jpg',
            }),
        };
    }
    catch (error) {
        console.error(`Error uploading image use S3Client:: ${error}`);
        throw error;
    }
});
exports.uploadImageFromLocalS3 = uploadImageFromLocalS3;
const uploadImageFromUrl = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/5406162374d7bbd35f41d32826c0721b';
        const folderName = 'product/shopId', newFileName = 'testDemo';
        const result = yield cloudinary_config_1.default.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName,
        });
        return result;
    }
    catch (error) {
        console.error(`Error uploading image:: ${error}`);
    }
});
exports.uploadImageFromUrl = uploadImageFromUrl;
const uploadImageFromLocal = (_b) => __awaiter(void 0, [_b], void 0, function* ({ path, folderName = 'product/8409' }) {
    try {
        const result = yield cloudinary_config_1.default.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName,
        });
        return {
            image_url: result.secure_url,
            shopId: 8409,
            thumb_url: yield cloudinary_config_1.default.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg',
            }),
        };
    }
    catch (error) {
        console.error(`Error uploading image:: ${error}`);
    }
});
exports.uploadImageFromLocal = uploadImageFromLocal;
const uploadMultiImageFromLocal = (_c) => __awaiter(void 0, [_c], void 0, function* ({ files, folderName = 'product/8409', }) {
    try {
        console.log(`files::`, files, folderName);
        if (!files.length)
            return;
        const uploadUrls = [];
        for (const file of files) {
            const result = yield cloudinary_config_1.default.uploader.upload(file.path, {
                folder: folderName,
            });
            uploadUrls.push({
                image_url: result.secure_url,
                shopId: 8409,
                thumb_url: yield cloudinary_config_1.default.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'jpg',
                }),
            });
        }
        return uploadUrls;
    }
    catch (error) {
        console.error(`Error uploading image:: ${error}`);
    }
});
exports.uploadMultiImageFromLocal = uploadMultiImageFromLocal;
