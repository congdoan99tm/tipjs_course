"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';
// Declare the Schema of the Mongo model
var inventorySchema = new mongoose_1.Schema({
    invent_productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
    invent_location: { type: String, default: 'unKnow' },
    invent_stock: { type: Number, require: true },
    invent_shopId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop' },
    invent_reservations: { type: Array, default: [] },
    /*
    cardId:,
    stock:1,
    createdOn:
    */
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
//Export the model
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, inventorySchema);
