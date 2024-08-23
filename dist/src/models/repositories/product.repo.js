"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProductByServer = exports.getProductById = exports.updateProductById = exports.findProduct = exports.findAllProducts = exports.searchProductByUser = exports.unPublishProductByShop = exports.publishProductByShop = exports.findAllPublishForShop = exports.findAllDraftForShop = exports.queryProduct = void 0;
const product_model_1 = require("../product.model");
const mongoose_1 = require("mongoose");
const index_1 = require("../../utils/index");
const error_response_1 = require("../../core/error.response");
const findAllDraftForShop = (_a) => __awaiter(void 0, [_a], void 0, function* ({ query, limit, skip }) {
    return yield queryProduct({ query, limit, skip });
});
exports.findAllDraftForShop = findAllDraftForShop;
const findAllPublishForShop = (_b) => __awaiter(void 0, [_b], void 0, function* ({ query, limit, skip }) {
    return yield queryProduct({ query, limit, skip });
});
exports.findAllPublishForShop = findAllPublishForShop;
const searchProductByUser = (_c) => __awaiter(void 0, [_c], void 0, function* ({ keySearch }) {
    const regexSearch = new RegExp(keySearch);
    const result = yield product_model_1.ProductModel.find({
        isPublished: true,
        $text: { $search: keySearch }, //regexSearch
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    return result;
});
exports.searchProductByUser = searchProductByUser;
const publishProductByShop = (_d) => __awaiter(void 0, [_d], void 0, function* ({ product_shop, product_id }) {
    const foundProduct = yield product_model_1.ProductModel.findOne({
        product_shop: new mongoose_1.Types.ObjectId(product_shop),
        _id: new mongoose_1.Types.ObjectId(product_id),
    });
    if (!foundProduct)
        throw new error_response_1.BadRequestError('Product not Found');
    foundProduct.isDraft = false;
    foundProduct.isPublished = true;
    const { modifiedCount } = yield foundProduct.updateOne(foundProduct);
    if (modifiedCount != 1)
        throw new error_response_1.BadRequestError('Fail to Publish');
    return foundProduct;
});
exports.publishProductByShop = publishProductByShop;
const unPublishProductByShop = (_e) => __awaiter(void 0, [_e], void 0, function* ({ product_shop, product_id }) {
    const foundProduct = yield product_model_1.ProductModel.findOne({
        product_shop: new mongoose_1.Types.ObjectId(product_shop),
        _id: new mongoose_1.Types.ObjectId(product_id),
    });
    if (!foundProduct)
        throw new error_response_1.BadRequestError('Product not Found');
    foundProduct.isDraft = true;
    foundProduct.isPublished = false;
    const { modifiedCount } = yield foundProduct.updateOne(foundProduct);
    if (modifiedCount != 1)
        throw new error_response_1.BadRequestError('Fail to UnPublish');
    return foundProduct;
});
exports.unPublishProductByShop = unPublishProductByShop;
const findAllProducts = (_f) => __awaiter(void 0, [_f], void 0, function* ({ limit, sort, page, filter, select }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = yield product_model_1.ProductModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select((0, index_1.getSelectData)(select))
        .lean();
    return products;
});
exports.findAllProducts = findAllProducts;
const findProduct = (_g) => __awaiter(void 0, [_g], void 0, function* ({ product_id, unSelect }) {
    return yield product_model_1.ProductModel.findById(product_id).select((0, index_1.unGetSelectData)(unSelect));
});
exports.findProduct = findProduct;
const updateProductById = (_h) => __awaiter(void 0, [_h], void 0, function* ({ productId, bodyUpdate, model, isNew = true, select = '', }) {
    return yield model
        .findByIdAndUpdate(productId, 
    // bodyUpdate,
    { $set: Object.assign({}, bodyUpdate) }, { upsert: true, new: isNew })
        .select(select)
        .lean();
});
exports.updateProductById = updateProductById;
const queryProduct = (_j) => __awaiter(void 0, [_j], void 0, function* ({ query, limit, skip }) {
    return yield product_model_1.ProductModel.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
});
exports.queryProduct = queryProduct;
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield product_model_1.ProductModel.findOne({
        _id: (0, index_1.convertToObjectIdMongodb)(productId),
    }).lean();
});
exports.getProductById = getProductById;
const checkProductByServer = (products) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const foundProduct = yield getProductById(product.productId);
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId,
            };
        }
    })));
});
exports.checkProductByServer = checkProductByServer;
