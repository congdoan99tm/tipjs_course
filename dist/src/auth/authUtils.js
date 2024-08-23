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
exports.verifyJWT = exports.authenticationV2 = exports.authentication = exports.createTokenPair = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const error_response_1 = require("../core/error.response");
const keyToken_service_1 = __importDefault(require("../services/keyToken.service"));
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id',
};
const createTokenPair = (payload, publicKey, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessToken
        const accessToken = yield jsonwebtoken_1.default.sign(payload, publicKey, {
            expiresIn: '2 days',
        });
        const refreshToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
            expiresIn: '7 days',
        });
        //
        jsonwebtoken_1.default.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err);
            }
            else {
                console.log(`decode verify::`, decode);
            }
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log('error createTokenPair', error);
    }
});
exports.createTokenPair = createTokenPair;
const authentication = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    1. Check userId missing?
    2. get accessToken.
    3. verify token.
    4. check user in dbs.
    5. check Keystore with this userId
    6. OK all => return next().
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId)
        throw new error_response_1.AuthFailureError('Invalid Request');
    const keyStore = yield keyToken_service_1.default.findByUserId(userId);
    if (!keyStore)
        throw new error_response_1.NotFoundError('Not found keyStore');
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken)
        throw new error_response_1.AuthFailureError('Invalid Request');
    try {
        const decodeToken = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeToken.userId)
            throw new error_response_1.AuthFailureError('Invalid UserId');
        req.user = decodeToken;
        req.keyStore = keyStore;
        return next();
    }
    catch (error) {
        throw error;
    }
}));
exports.authentication = authentication;
const authenticationV2 = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId)
        throw new error_response_1.AuthFailureError('Invalid Request');
    const keyStore = yield keyToken_service_1.default.findByUserId(userId);
    if (!keyStore)
        throw new error_response_1.NotFoundError('Not found keyStore');
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = jsonwebtoken_1.default.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId)
                throw new error_response_1.AuthFailureError('Invalid UserId');
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        }
        catch (error) {
            throw error;
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken)
        throw new error_response_1.AuthFailureError('Invalid Request');
    try {
        const decodeToken = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeToken.userId)
            throw new error_response_1.AuthFailureError('Invalid UserId');
        req.user = decodeToken;
        req.keyStore = keyStore;
        return next();
    }
    catch (error) {
        throw error;
    }
}));
exports.authenticationV2 = authenticationV2;
const verifyJWT = (token, keySecret) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.verify(token, keySecret);
});
exports.verifyJWT = verifyJWT;
