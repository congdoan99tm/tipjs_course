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
exports.createTokenPairPro = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createTokenPairPro = (payload, publicKey, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessToken
        const accessToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        });
        const refreshToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
            algorithm: 'RS256',
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
exports.createTokenPairPro = createTokenPairPro;
