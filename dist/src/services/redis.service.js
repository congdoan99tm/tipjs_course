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
const ioredis_1 = __importDefault(require("ioredis"));
const util_1 = require("util");
const inventory_repo_1 = __importDefault(require("../models/repositories/inventory.repo"));
const redisClient = new ioredis_1.default({
    host: '127.0.0.1',
    port: 6379,
});
const pExpire = (0, util_1.promisify)(redisClient.pexpire).bind(redisClient);
const setNXAsync = (0, util_1.promisify)(redisClient.setnx).bind(redisClient);
const delAsyncKey = (0, util_1.promisify)(redisClient.del).bind(redisClient);
const acquireLock = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, quantity, cartId }) {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3; // 3 seconds tam lock
    for (let i = 0; i < retryTimes; i++) {
        // tạo 1 key, ai nắm giữ được vào thanh toán
        const result = yield setNXAsync(key, '');
        if (result === 1) {
            // thao tác với inventory
            const isReservation = yield inventory_repo_1.default.reservationInventory({
                productId,
                quantity,
                cartId,
            });
            if (isReservation.matchedCount) {
                yield pExpire(key, expireTime);
                return key;
            }
            return null;
        }
        else {
            yield new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
});
const releaseLock = (keyLock) => __awaiter(void 0, void 0, void 0, function* () {
    return yield delAsyncKey(keyLock);
});
exports.default = {
    acquireLock,
    releaseLock,
};
