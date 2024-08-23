"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        require: true,
        ref: 'Shop',
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: Array,
        default: [],
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, { collection: COLLECTION_NAME, timestamps: true });
//Export the model
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, keyTokenSchema);
