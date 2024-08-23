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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const keyToken_model_1 = __importDefault(require("../models/keyToken.model"));
class KeyTokenService {
    static createKeyToken(_b) {
        return __awaiter(this, arguments, void 0, function* ({ userId, publicKey, privateKey, refreshToken, // refreshToken là tùy chọn
         }) {
            try {
                // level 0
                // const tokens = await keyTokenModel.create({
                //   user: userId,
                //   publicKey,
                //   privateKey,
                // });
                const filter = {
                    user: userId,
                }, update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                }, options = {
                    upsert: true,
                    new: true,
                };
                const tokens = yield keyToken_model_1.default.findOneAndUpdate(filter, update, options);
                return tokens ? tokens.publicKey : null;
            }
            catch (error) {
                return error;
            }
        });
    }
    ;
}
_a = KeyTokenService;
KeyTokenService.findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.findOne({ user: new mongoose_1.Types.ObjectId(userId) });
});
KeyTokenService.removeKeyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.deleteMany(id);
});
KeyTokenService.findByRefreshTokenUsed = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.findOne({ refreshTokensUsed: refreshToken }).lean();
});
KeyTokenService.deleteKeyById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.deleteOne({ user: new mongoose_1.Types.ObjectId(userId) });
});
KeyTokenService.findByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyToken_model_1.default.findOne({ refreshToken });
});
exports.default = KeyTokenService;
