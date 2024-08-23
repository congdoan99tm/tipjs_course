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
exports.permission = exports.apiKey = void 0;
const error_response_1 = require("../core/error.response");
const apikey_service_1 = __importDefault(require("../services/apikey.service"));
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
};
const apiKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const key = (_a = req.headers[HEADER.API_KEY]) === null || _a === void 0 ? void 0 : _a.toString();
        if (!key) {
            throw new error_response_1.BadRequestError('Forbidden Error');
        }
        // check objKey
        const objKey = yield apikey_service_1.default.findById(key);
        if (!objKey) {
            throw new error_response_1.BadRequestError();
        }
        req.objKey = objKey;
        return next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.apiKey = apiKey;
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            throw new error_response_1.BadRequestError('Permission denied');
        }
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            throw new error_response_1.BadRequestError('Permission denied');
        }
        return next();
    };
};
exports.permission = permission;
