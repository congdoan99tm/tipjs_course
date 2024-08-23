"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';
// ORDER-001: order successfully
// ORDER-002: order fail
// PROMOTION-001: bew PROMOTION
// SHOP-001: new product by user following
const notificationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        require: true,
    },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, require: true, ref: 'Shop' },
    receivedId: { type: Number, require: true },
    content: { type: String, require: true },
    options: { type: Object, default: {} },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
//Export the model
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, notificationSchema);
