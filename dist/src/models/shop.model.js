"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';
var shopSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    verify: {
        type: Boolean,
        default: false,
    },
    roles: {
        type: Array,
        default: [],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
//Export the model
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, shopSchema);
