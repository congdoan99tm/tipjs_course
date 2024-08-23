"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBucketCommand = exports.GetObjectCommand = exports.PutObjectCommand = exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
Object.defineProperty(exports, "PutObjectCommand", { enumerable: true, get: function () { return client_s3_1.PutObjectCommand; } });
Object.defineProperty(exports, "GetObjectCommand", { enumerable: true, get: function () { return client_s3_1.GetObjectCommand; } });
Object.defineProperty(exports, "DeleteBucketCommand", { enumerable: true, get: function () { return client_s3_1.DeleteBucketCommand; } });
const s3Config = {
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
    },
};
const s3 = new client_s3_1.S3Client(s3Config);
exports.s3 = s3;
