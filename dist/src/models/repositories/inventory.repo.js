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
const inventory_model_1 = __importDefault(require("../inventory.model"));
const utils_1 = require("../../utils");
const insertInventory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, shopId, stock, location = 'unKnow' }) {
    return yield inventory_model_1.default.create({
        invent_productId: productId,
        invent_shopId: shopId,
        invent_location: location,
        invent_stock: stock,
    });
});
const reservationInventory = (_b) => __awaiter(void 0, [_b], void 0, function* ({ productId, quantity, cartId }) {
    const query = {
        invent_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
        invent_stock: { $gte: quantity },
    }, updateSet = {
        $inc: {
            invent_stock: -quantity,
        },
        $push: {
            invent_reservations: {
                quantity,
                cartId,
                createOn: new Date(),
            },
        },
    }, options = { upsert: true, new: true };
    return yield inventory_model_1.default.updateOne(query, updateSet);
});
exports.default = { insertInventory, reservationInventory };
