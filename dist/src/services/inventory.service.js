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
const error_response_1 = require("../core/error.response");
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const product_repo_1 = require("../models/repositories/product.repo");
class InventoryService {
    static addStockToInventory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ stock, productId, shopId, location = '134, Tran Phu, HCM city', }) {
            const product = yield (0, product_repo_1.getProductById)(productId);
            if (!product)
                throw new error_response_1.BadRequestError('The product does not exists!');
            const query = { invent_shopId: shopId, invent_productId: productId }, updateSet = {
                $inc: {
                    invent_stock: stock,
                },
                $set: {
                    invent_location: location,
                },
            }, options = {
                upsert: true,
                new: true,
            };
            return yield inventory_model_1.default.findOneAndUpdate(query, updateSet, options);
        });
    }
}
exports.default = InventoryService;
