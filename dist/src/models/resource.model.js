"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = 'Resource';
const COLLECTION_NAME = 'Resources';
const resourceSchema = new mongoose_1.Schema({
    src_name: { type: String, require: true },
    src_slug: { type: String, require: true },
    src_description: { type: String, default: '' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, resourceSchema);
