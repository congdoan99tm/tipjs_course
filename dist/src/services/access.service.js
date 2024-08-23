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
const bcrypt_1 = __importDefault(require("bcrypt"));
const shop_model_1 = __importDefault(require("../models/shop.model"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const keyToken_service_1 = __importDefault(require("./keyToken.service"));
const authUtils_1 = require("../auth/authUtils");
const index_1 = require("../utils/index");
const error_response_1 = require("../core/error.response");
const shop_service_1 = __importDefault(require("./shop.service"));
const RoleShop = {
    SHOP: 'shop',
    WRITER: '0001',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};
class AccessService {
}
_a = AccessService;
//v2
AccessService.handleRefreshTokenV2 = (_b) => __awaiter(void 0, [_b], void 0, function* ({ keyStore, user, refreshToken }) {
    var { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
        yield keyToken_service_1.default.deleteKeyById(userId);
        throw new error_response_1.ForbiddenError(`Something wrong happened !! Pls reLogin`);
    }
    if (keyStore.refreshToken != refreshToken)
        throw new error_response_1.AuthFailureError(`Shop not registered`);
    const foundShop = yield (0, shop_service_1.default)({ email: email });
    if (!foundShop)
        throw new error_response_1.AuthFailureError(`Shop not registered 2`);
    // Create 1 cap moi
    const tokens = yield (0, authUtils_1.createTokenPair)({ userId: userId, email }, keyStore.publicKey, keyStore.privateKey);
    // update token
    yield keyStore.updateOne({
        $set: {
            refreshToken: tokens.refreshToken,
        },
        $addToSet: {
            refreshTokensUsed: refreshToken, // da duoc su dung.
        },
    });
    return {
        user,
        tokens,
    };
});
AccessService.handleRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    // check this token used?
    const foundToken = yield keyToken_service_1.default.findByRefreshTokenUsed(refreshToken);
    // neu co
    if (foundToken) {
        // decode xem thang ml nao?
        const { userId, email } = yield (0, authUtils_1.verifyJWT)(refreshToken, foundToken.privateKey);
        console.log({ userId, email });
        //xoa tat ca token trong keyStore
        yield keyToken_service_1.default.deleteKeyById(userId);
        throw new error_response_1.ForbiddenError(`Something wrong happened !! Pls reLogin`);
    }
    // Chua co?
    const holderToken = yield keyToken_service_1.default.findByRefreshToken(refreshToken);
    // Neu k thay
    if (!holderToken)
        throw new error_response_1.AuthFailureError(`Shop not registered 1`);
    // Verify token
    const { userId, email } = yield (0, authUtils_1.verifyJWT)(refreshToken, holderToken.privateKey);
    console.log(email);
    // Check userId
    const foundShop = yield (0, shop_service_1.default)({ email: email });
    if (!foundShop)
        throw new error_response_1.AuthFailureError(`Shop not registered 2`);
    // Create 1 cap moi
    const tokens = yield (0, authUtils_1.createTokenPair)({ userId: userId, email }, holderToken.publicKey, holderToken.privateKey);
    // update token
    yield holderToken.updateOne({
        $set: {
            refreshToken: tokens.refreshToken,
        },
        $addToSet: {
            refreshTokensUsed: refreshToken, // da duoc su dung.
        },
    });
    return {
        user: { userId, email },
        tokens,
    };
});
AccessService.logout = (_c) => __awaiter(void 0, [_c], void 0, function* ({ keyStore }) {
    const delKey = yield keyToken_service_1.default.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
});
AccessService.login = (_d) => __awaiter(void 0, [_d], void 0, function* ({ email, password, refreshToken = null }) {
    //1. check Email
    const foundShop = yield (0, shop_service_1.default)({ email });
    if (!foundShop)
        throw new error_response_1.BadRequestError('Shop not registered!');
    //2. check pass
    const match = bcrypt_1.default.compare(password, foundShop.password);
    if (!match)
        throw new error_response_1.BadRequestError('Authentication error');
    //3. create keys
    const publicKey = node_crypto_1.default.randomBytes(64).toString('hex');
    const privateKey = node_crypto_1.default.randomBytes(64).toString('hex');
    //4. generate tokens
    const { _id: userId } = foundShop;
    const tokens = yield (0, authUtils_1.createTokenPair)({ userId: userId, email: email }, publicKey, privateKey);
    yield keyToken_service_1.default.createKeyToken({
        userId: userId,
        refreshToken: tokens.refreshToken,
        privateKey,
        publicKey,
    });
    return {
        shop: (0, index_1.getInfoData)({
            fields: ['_id', 'name', 'email'],
            object: foundShop,
        }),
        tokens,
    };
});
AccessService.signUp = (_e) => __awaiter(void 0, [_e], void 0, function* ({ name, email, password }) {
    // step1: check email exists???
    const holderShop = yield shop_model_1.default.findOne({ email }).lean();
    if (holderShop) {
        throw new error_response_1.BadRequestError('Error: Shop already register');
    }
    const passwordHash = yield bcrypt_1.default.hash(password, 1);
    const newShop = yield shop_model_1.default.create({
        name: name,
        email: email,
        password: passwordHash,
        roles: RoleShop,
    });
    if (newShop) {
        const publicKey = node_crypto_1.default.randomBytes(64).toString('hex');
        const privateKey = node_crypto_1.default.randomBytes(64).toString('hex');
        const keyStore = yield keyToken_service_1.default.createKeyToken({
            userId: newShop._id,
            publicKey,
            privateKey,
        });
        if (!keyStore) {
            throw new error_response_1.BadRequestError('Error: PublicKey error');
        }
        const tokens = yield (0, authUtils_1.createTokenPair)({ userId: newShop._id, email }, publicKey, privateKey);
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
exports.default = AccessService;
