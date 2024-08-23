"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';
// Declare the Schema of the Mongo model
var commentSchema = new mongoose_1.Schema({
    comment_productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
    comment_userId: { type: Number, default: 1 },
    comment_content: { type: String, default: 'text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
//Export the model
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, commentSchema);
