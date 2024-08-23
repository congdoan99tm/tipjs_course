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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../core/success.response");
// import ProductService from '../services/product.service'
const product_service_xxx_1 = __importDefault(require("../services/product.service.xxx"));
class ProductController {
    constructor() {
        this.createProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Create new Product Success!',
                metadata: yield product_service_xxx_1.default.createProduct(req.body.product_type, Object.assign(Object.assign({}, req.body), { product_shop: req.user.userId })),
            }).send(res);
        });
        this.updateProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Update Product Success!',
                metadata: yield product_service_xxx_1.default.updateProduct(req.body.product_type, req.params.productId, Object.assign(Object.assign({}, req.body), { product_shop: req.user.userId })),
            }).send(res);
        });
        this.publishProductByShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Publish Product Success!',
                metadata: yield product_service_xxx_1.default.publishProductByShop({
                    product_id: req.params.id,
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        this.unPublishProductByShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'UnPublish Product Success!',
                metadata: yield product_service_xxx_1.default.unPublishProductByShop({
                    product_id: req.params.id,
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        this.getAllDraftsForShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Get list Drafts Success!',
                metadata: yield product_service_xxx_1.default.findAllDraftsForShop({
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        this.getAllPublishForShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Get list getAllPublishForShop Success!',
                metadata: yield product_service_xxx_1.default.findAllPublishForShop({
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        this.getListSearchProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Get list getListSearchProduct Success!',
                metadata: yield product_service_xxx_1.default.searchProduct(req.params),
            }).send(res);
        });
        this.findAllProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Get All Product Success!',
                metadata: yield product_service_xxx_1.default.findAllProducts(req.query),
            }).send(res);
        });
        this.findProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Get Product Success!',
                metadata: yield product_service_xxx_1.default.findProducts({
                    product_id: req.params.product_id,
                }),
            }).send(res);
        });
    }
}
exports.default = new ProductController();
