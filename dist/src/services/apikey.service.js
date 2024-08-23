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
const crypto_1 = __importDefault(require("crypto"));
const apikey_model_1 = __importDefault(require("../models/apikey.model"));
const error_response_1 = require("../core/error.response");
class ApiKeyService {
}
_a = ApiKeyService;
ApiKeyService.findById = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const objKey = yield apikey_model_1.default.findOne({ key, status: true }).lean();
    return objKey;
});
ApiKeyService.create = (pass) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKeyPass = process.env.API_KEY_PASS;
    if (pass.toString() !== apiKeyPass) {
        throw new error_response_1.BadRequestError();
    }
    const newKey = yield apikey_model_1.default.create({
        key: crypto_1.default.randomBytes(64).toString('hex'),
        permissions: ['0000'],
    });
    return newKey;
});
exports.default = ApiKeyService;
