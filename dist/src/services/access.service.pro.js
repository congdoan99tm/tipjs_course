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
const bcrypt = require("bcrypt");
const shop_model_1 = __importDefault(require("../models/shop.model"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const keyToken_service_1 = __importDefault(require("./keyToken.service"));
const authUtils_pro_1 = require("../auth/authUtils.pro");
const index_1 = require("../utils/index");
const error_response_1 = require("../core/error.response");
// cách siêu cấp vip pro
class AccessServicePro {
}
_a = AccessServicePro;
AccessServicePro.signUp = (_b) => __awaiter(void 0, [_b], void 0, function* ({ name, email, password }) {
    // step1: check email exists???
    const holderShop = yield shop_model_1.default.findOne({ email }).lean();
    if (holderShop) {
        throw new error_response_1.BadRequestError('Error: Shop already register');
    }
    const passwordHash = yield bcrypt.hash(password, 1);
    const RoleShop = [];
    const newShop = yield shop_model_1.default.create({
        name: name,
        email: email,
        password: passwordHash,
        roles: RoleShop,
    });
    if (newShop) {
        const { privateKey, publicKey } = node_crypto_1.default.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });
        const publicKeyString = yield keyToken_service_1.default.createKeyToken({
            userId: newShop._id,
            publicKey,
        });
        if (!publicKeyString) {
            throw new error_response_1.BadRequestError('Error: PublicKey error');
        }
        console.log(`publicKeyString::`, publicKeyString);
        const publicKeyObject = node_crypto_1.default.createPublicKey(publicKeyString);
        console.log(`publicKeyObject::`, publicKeyObject);
        const tokens = yield (0, authUtils_pro_1.createTokenPairPro)({ userId: newShop._id, email }, publicKeyObject, privateKey);
        console.log(`create token success::`, tokens);
        return {
            shop: (0, index_1.getInfoData)({
                fields: ['_id', 'name', 'email'],
                object: newShop,
            }),
            tokens,
        };
    }
    return null;
});
exports.default = AccessServicePro;
