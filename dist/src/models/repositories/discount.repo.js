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
exports.findAllDiscountCodesSelect = exports.findAllDiscountCodesUnselect = exports.checkDiscountExist = void 0;
const discount_model_1 = __importDefault(require("../discount.model"));
const utils_1 = require("../../utils");
const checkDiscountExist = (_a) => __awaiter(void 0, [_a], void 0, function* ({ code, shopId }) {
    // const foundDiscount = await model.findOne(filter).lean();
    const foundDiscount = yield discount_model_1.default
        .findOne({
        discount_code: code,
        discount_shopId: (0, utils_1.convertToObjectIdMongodb)(shopId),
    })
        .lean();
    return foundDiscount;
});
exports.checkDiscountExist = checkDiscountExist;
const findAllDiscountCodesUnselect = (_b) => __awaiter(void 0, [_b], void 0, function* ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect, model, }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = yield model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select((0, utils_1.unGetSelectData)(unSelect))
        .lean();
    return documents;
});
exports.findAllDiscountCodesUnselect = findAllDiscountCodesUnselect;
const findAllDiscountCodesSelect = (_c) => __awaiter(void 0, [_c], void 0, function* ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect, model, }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = yield model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select((0, utils_1.getSelectData)(unSelect))
        .lean();
    return documents;
});
exports.findAllDiscountCodesSelect = findAllDiscountCodesSelect;
