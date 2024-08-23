"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); // Erase if already required
const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';
// Declare the Schema of the Mongo model
var apiKeySchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        default: ['0000', '1111', '2222'],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
//Export the model
exports.default = mongoose_1.default.model(DOCUMENT_NAME, apiKeySchema);
