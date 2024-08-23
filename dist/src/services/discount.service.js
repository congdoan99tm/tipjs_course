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
const discount_model_1 = __importDefault(require("../models/discount.model"));
const utils_1 = require("../utils");
const product_service_xxx_1 = __importDefault(require("./product.service.xxx"));
const discount_repo_1 = require("../models/repositories/discount.repo");
/*

   1 - Generator Discount Code [Shop  | Admin]
   2 - Get discount Amount
   3 - Get all discount codes [User | Shop]
   4 - Verify discount code [user]
   5- Delete discount code [Admin| Shop]
   6 - Cancel discount code [user]
*/
class DiscountService {
    static createDiscountCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type, value, max_value, max_uses, uses_count, users_used, max_uses_per_user, } = payload;
            //kiem tra tinh hop le data
            // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            //   throw new BadRequestError('Discount code has expired!');
            // }
            if (new Date(start_date) >= new Date(end_date)) {
                throw new error_response_1.BadRequestError('Start date must be before end_date');
            }
            // create index for discount code
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExist)({
                code,
                shopId,
            });
            if (foundDiscount)
                throw new error_response_1.BadRequestError('Discount exists!');
            const newDiscount = yield discount_model_1.default.create({
                discount_name: name,
                discount_descriptions: description,
                discount_type: type,
                discount_value: value,
                discount_max_value: max_value,
                discount_code: code,
                discount_start_date: new Date(start_date),
                discount_end_date: new Date(end_date),
                discount_max_uses: max_uses,
                discount_uses_count: uses_count,
                discount_users_used: users_used,
                discount_max_uses_per_user: max_uses_per_user,
                discount_min_order_value: min_order_value || 0,
                discount_shopId: shopId,
                discount_is_active: is_active,
                discount_applies_to: applies_to,
                discount_product_ids: applies_to === 'all' ? [] : product_ids,
            });
            return newDiscount;
        });
    }
    static updateDiscountCode(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body.code || !body.shopId)
                throw new error_response_1.BadRequestError('Invalid code or shopId');
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExist)({
                code: body.code,
                shopId: body.shopId,
            });
            if (!foundDiscount)
                throw new error_response_1.BadRequestError(`Discount Doesn't exists`);
            const newDiscount = yield discount_model_1.default.findByIdAndUpdate(id, { $set: (0, utils_1.removeUndefinedObject)(body) }, { upsert: true, new: true });
            return newDiscount;
        });
    }
    static getAllDiscountCodesWithProduct(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, shopId, userId, limit, page, }) {
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExist)({
                code,
                shopId,
            });
            if (!foundDiscount || !foundDiscount.discount_is_active) {
                throw new error_response_1.NotFoundError('Discount not exists!');
            }
            const { discount_applies_to, discount_product_ids } = foundDiscount;
            let product;
            if (discount_applies_to === 'all') {
                // get all product
                product = yield product_service_xxx_1.default.findAllProducts({
                    filter: {
                        product_shop: (0, utils_1.convertToObjectIdMongodb)(shopId),
                        isPublished: true,
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name'],
                });
            }
            if (discount_applies_to === 'specific') {
                // get the product ids
                product = yield product_service_xxx_1.default.findAllProducts({
                    filter: {
                        _id: { $in: discount_product_ids },
                        isPublished: true,
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name'],
                });
            }
            return product;
        });
    }
    static getAllDiscountCodesByShop(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit, page, shopId }) {
            const discounts = yield (0, discount_repo_1.findAllDiscountCodesUnselect)({
                limit: +limit,
                page: +page,
                filter: {
                    discount_shopId: (0, utils_1.convertToObjectIdMongodb)(shopId),
                    discount_is_active: true,
                },
                unSelect: ['__v', 'discount_shopId'],
                model: discount_model_1.default,
            });
            return discounts;
        });
    }
    static getDiscountAmount(_a) {
        return __awaiter(this, arguments, void 0, function* ({ codeId, userId, shopId, products }) {
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExist)({
                code: codeId,
                shopId: shopId,
            });
            if (!foundDiscount)
                throw new error_response_1.NotFoundError(`Discount Doesn't exists!`);
            const { discount_is_active, discount_max_uses, discount_start_date, discount_end_date, discount_users_used, discount_min_order_value, discount_max_uses_per_user, discount_type, discount_value, } = foundDiscount;
            if (!discount_is_active)
                throw new error_response_1.NotFoundError(`discount expired!`);
            if (!discount_max_uses)
                throw new error_response_1.NotFoundError(`discount are out!`);
            // if (
            //   new Date() < new Date(discount_start_date) ||
            //   new Date() > new Date(discount_end_date)
            // ) {
            //   throw new NotFoundError(`discount code has expired!`);
            // }
            //check xem co set gia tri toi thieu hay k.
            let totalOrder = 0;
            if (discount_min_order_value > 0) {
                // get tong gia tri don hang
                totalOrder = products.reduce((acc, product) => {
                    return acc + product.quantity * product.price;
                }, 0);
                if (totalOrder < discount_min_order_value) {
                    throw new error_response_1.NotFoundError(`discount requires a minium order value of ${discount_min_order_value}!`);
                }
            }
            if (discount_max_uses_per_user > 0) {
                const userUserDiscount = discount_users_used.find((user) => user.userId === userId);
                if (userUserDiscount) {
                    // ....
                    throw new error_response_1.NotFoundError(`Bạn đã sử dụng quá số lượng cho phép. Vui lòng thử lại sau.!`);
                }
            }
            // check xem discount nay la fixed amount hay
            const amount = discount_type === 'fixed_amount'
                ? discount_value
                : totalOrder * (discount_value / 100);
            return {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount,
            };
        });
    }
    static deleteDiscountCode(_a) {
        return __awaiter(this, arguments, void 0, function* ({ shopId, codeId }) {
            const deleted = yield discount_model_1.default.findOneAndDelete({
                discount_code: codeId,
                discount_shopId: (0, utils_1.convertToObjectIdMongodb)(shopId),
            });
            return deleted;
        });
    }
    static cancelDiscountCode(_a) {
        return __awaiter(this, arguments, void 0, function* ({ codeId, shopId, userId }) {
            const foundDiscount = yield (0, discount_repo_1.checkDiscountExist)({
                code: codeId,
                shopId: shopId,
            });
            if (!foundDiscount)
                throw new error_response_1.NotFoundError(`discount does'n't exist`);
            const result = yield discount_model_1.default.findByIdAndUpdate(foundDiscount._id, {
                $pull: {
                    discount_users_used: userId,
                },
                $inc: {
                    discount_max_uses: 1,
                    discount_uses_count: -1,
                },
            });
            return result;
        });
    }
}
exports.default = DiscountService;
