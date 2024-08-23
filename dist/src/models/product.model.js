"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FurnitureModel = exports.ElectronicModel = exports.ClothingModel = exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
const productSchema = new mongoose_1.Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: {
        type: String,
        require: true,
        enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: mongoose_1.Schema.Types.Mixed, require: true },
    //more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        // 4.3334 => 4.3
        set: (val) => Math.round((val * 10) / 10),
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: true },
    isPublished: { type: Boolean, default: false, index: true, select: true },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});
// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' });
// Document middleware: runs before .save() and .create()...
productSchema.pre('save', function (next) {
    (this.product_slug = (0, slugify_1.default)(this.product_name)), { lower: true };
    next();
});
// define the product type = clothing
const clothingSchema = new mongoose_1.Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
}, {
    collection: 'clothes',
    timestamps: true,
});
// define the product type = electronics
const electronicSchema = new mongoose_1.Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
}, {
    collection: 'electronics',
    timestamps: true,
});
const furnitureSchema = new mongoose_1.Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
}, {
    collection: 'furnitures',
    timestamps: true,
});
// module.exports = {
//   product: model(DOCUMENT_NAME, productSchema),
//   clothing: model('Clothing', clothingSchema),
//   electronic: model('Electronics', electronicSchema),
//   furniture: model('Furniture', furnitureSchema),
// };
// Create models
const ProductModel = (0, mongoose_1.model)(DOCUMENT_NAME, productSchema);
exports.ProductModel = ProductModel;
const ClothingModel = (0, mongoose_1.model)('Clothing', clothingSchema);
exports.ClothingModel = ClothingModel;
const ElectronicModel = (0, mongoose_1.model)('Electronics', electronicSchema);
exports.ElectronicModel = ElectronicModel;
const FurnitureModel = (0, mongoose_1.model)('Furniture', furnitureSchema);
exports.FurnitureModel = FurnitureModel;
