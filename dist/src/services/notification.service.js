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
exports.listNotiByUser = exports.pushNotiToSystem = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const pushNotiToSystem = (_a) => __awaiter(void 0, [_a], void 0, function* ({ type = 'SHOP-001', receivedId = 1, senderId = 1, options = {}, }) {
    let content;
    if (type === 'SHOP-001') {
        content = `${options['shop_name']} vừa thêm một sản phẩm mới: ${options['product_name']}`;
    }
    else if (type === 'PROMOTION-001') {
        content = `${options['shop_name']} vừa thêm một voucher mới: @@@@`;
    }
    const newNoti = yield notification_model_1.default.create({
        type,
        content,
        senderId,
        receivedId,
        options,
    });
    return newNoti;
});
exports.pushNotiToSystem = pushNotiToSystem;
const listNotiByUser = (_b) => __awaiter(void 0, [_b], void 0, function* ({ userId = 1, type = 'ALL', isRead = 1 }) {
    const match = { receivedId: userId };
    if (type !== 'ALL') {
        match['type'] = type;
    }
    return yield notification_model_1.default.aggregate([
        {
            $match: match,
        },
        // {
        //   $project: {
        //     type: 1,
        //     senderId: 1,
        //     receivedId: 1,
        //     content: {
        //       $concat: [
        //         { $substr: ['$options.shop_name', 0, -1] },
        //         ' vừa mới thêm một sản phẩm mới: ',
        //         {
        //           $substr: ['$options.product_name', 0, -1],
        //         },
        //       ],
        //     },
        //     createAt: 1,
        //     options: 1,
        //   },
        // },
    ]);
});
exports.listNotiByUser = listNotiByUser;
