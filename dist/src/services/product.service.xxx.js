'use strict';
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
const product_model_1 = require("../models/product.model");
const error_response_1 = require("../core/error.response");
const product_repo_1 = require("../models/repositories/product.repo");
const utils_1 = require("../utils");
const inventory_repo_1 = __importDefault(require("../models/repositories/inventory.repo"));
const notification_service_1 = require("./notification.service");
const shop_model_1 = __importDefault(require("../models/shop.model"));
const index_1 = require("../utils/index");
// define Factory class to create product
class ProductFactory {
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    static createProduct(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const productClass = ProductFactory.productRegistry[type];
            if (!productClass) {
                throw new error_response_1.BadRequestError(`Invalid product Type ${type}`);
            }
            return new productClass(payload).createProduct();
        });
    }
    static updateProduct(type, productId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const productClass = ProductFactory.productRegistry[type];
            if (!productClass) {
                throw new error_response_1.BadRequestError(`Invalid product Type ${type}`);
            }
            return new productClass(payload).updateProduct(productId);
        });
    }
    // PUT
    static publishProductByShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_shop, product_id }) {
            return yield (0, product_repo_1.publishProductByShop)({ product_shop, product_id });
        });
    }
    //END PUT
    static unPublishProductByShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_shop, product_id }) {
            return yield (0, product_repo_1.unPublishProductByShop)({ product_shop, product_id });
        });
    }
    static findAllDraftsForShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_shop, limit = 50, skip = 0 }) {
            const query = { product_shop, isDraft: true };
            return yield (0, product_repo_1.findAllDraftForShop)({ query, limit, skip });
        });
    }
    static findAllPublishForShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_shop, limit = 50, skip = 0 }) {
            const query = { product_shop, isPublished: true };
            return yield (0, product_repo_1.findAllPublishForShop)({ query, limit, skip });
        });
    }
    static searchProduct(_a) {
        return __awaiter(this, arguments, void 0, function* ({ keySearch }) {
            return yield (0, product_repo_1.searchProductByUser)({ keySearch: keySearch });
        });
    }
    static findAllProducts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 50, sort = 'ctime', page = 1, filter, select = ['product_name', 'product_price', 'product_thumb', 'product_shop'], }) {
            return yield (0, product_repo_1.findAllProducts)({
                limit,
                sort,
                page,
                filter,
                select: select,
            });
        });
    }
    static findProducts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ product_id }) {
            return yield (0, product_repo_1.findProduct)({ product_id, unSelect: ['__v'] });
        });
    }
}
ProductFactory.productRegistry = {}; // key-class
// define base product class
/*
   product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: {
      type: String,
      require: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref:'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true },
 
*/
class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes, }) {
        (this.product_name = product_name),
            (this.product_thumb = product_thumb),
            (this.product_description = product_description),
            (this.product_price = product_price),
            (this.product_quantity = product_quantity),
            (this.product_type = product_type),
            (this.product_shop = product_shop),
            (this.product_attributes = product_attributes);
    }
    // create product
    createProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = yield product_model_1.ProductModel.create(Object.assign(Object.assign({}, this), { _id: productId }));
            if (newProduct) {
                // add product_stock in inventory collection
                yield inventory_repo_1.default.insertInventory({
                    productId: newProduct._id,
                    shopId: this.product_shop,
                    stock: this.product_quantity,
                });
                // push Notify to list Notify
                const shopFound = yield shop_model_1.default
                    .findById((0, index_1.convertToObjectIdMongodb)(this.product_shop))
                    .lean();
                if (shopFound) {
                    (0, notification_service_1.pushNotiToSystem)({
                        type: 'SHOP-001',
                        receivedId: 1,
                        senderId: this.product_shop,
                        options: {
                            product_name: this.product_name,
                            shop_name: shopFound.name,
                        },
                    })
                        .then((rs) => console.log(rs))
                        .catch(console.error);
                }
            }
            return newProduct;
        });
    }
    // update Product
    updateProduct(productId, bodyUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, product_repo_1.updateProductById)({
                productId,
                bodyUpdate,
                model: product_model_1.ProductModel,
            });
        });
    }
}
// define sub-class for different product types Clothing
class Clothing extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newClothing = yield product_model_1.ClothingModel.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newClothing)
                throw new error_response_1.BadRequestError('Create new Clothing error');
            const newProduct = _super.createProduct.call(this, newClothing._id);
            if (!newProduct)
                throw new error_response_1.BadRequestError('Create new Product error');
            return newProduct;
        });
    }
    updateProduct(productId) {
        const _super = Object.create(null, {
            updateProduct: { get: () => super.updateProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const objectParams = (0, utils_1.removeUndefinedObject)(this);
            if (objectParams.product_attributes) {
                yield (0, product_repo_1.updateProductById)({
                    productId,
                    bodyUpdate: (0, utils_1.updateNestedObjectParser)(objectParams.product_attributes),
                    model: product_model_1.ClothingModel,
                });
            }
            const updateProduct = yield _super.updateProduct.call(this, productId, (0, utils_1.updateNestedObjectParser)(objectParams));
            return updateProduct;
        });
    }
}
// define sub-class for different product types Electronics
class Electronics extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newElectronic = yield product_model_1.ElectronicModel.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newElectronic)
                throw new error_response_1.BadRequestError('Create new Electronic error');
            const newProduct = _super.createProduct.call(this, newElectronic._id);
            if (!newProduct)
                throw new error_response_1.BadRequestError('Create new Product error');
            return newProduct;
        });
    }
    updateProduct(productId) {
        const _super = Object.create(null, {
            updateProduct: { get: () => super.updateProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const objectParams = (0, utils_1.removeUndefinedObject)(this);
            if (objectParams.product_attributes) {
                // $set chỉ tác dụng - so sánh nông, không hoạt động với object in object.
                //-> gán objectChild updated vào object
                yield (0, product_repo_1.updateProductById)({
                    productId,
                    bodyUpdate: (0, utils_1.updateNestedObjectParser)(objectParams.product_attributes),
                    model: product_model_1.ElectronicModel,
                    // select: '-_id manufacturer model color',
                });
            }
            const updateProduct = yield _super.updateProduct.call(this, productId, (0, utils_1.updateNestedObjectParser)(objectParams));
            return updateProduct;
        });
    }
}
class Furniture extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newFurniture = yield product_model_1.FurnitureModel.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newFurniture)
                throw new error_response_1.BadRequestError('Create new Furniture error');
            const newProduct = _super.createProduct.call(this, newFurniture._id);
            if (!newProduct)
                throw new error_response_1.BadRequestError('Create new Product error');
            return newProduct;
        });
    }
    updateProduct(productId) {
        const _super = Object.create(null, {
            updateProduct: { get: () => super.updateProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const objectParams = (0, utils_1.removeUndefinedObject)(this);
            if (objectParams.product_attributes) {
                yield (0, product_repo_1.updateProductById)({
                    productId,
                    bodyUpdate: (0, utils_1.updateNestedObjectParser)(objectParams.product_attributes),
                    model: product_model_1.FurnitureModel,
                });
            }
            const updateProduct = yield _super.updateProduct.call(this, productId, (0, utils_1.updateNestedObjectParser)(objectParams));
            return updateProduct;
        });
    }
}
//register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);
exports.default = ProductFactory;
