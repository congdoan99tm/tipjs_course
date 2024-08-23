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
const error_response_1 = require("../core/error.response");
const role_middleware_1 = __importDefault(require("./role.middleware"));
/**
 *
 * @param action // read, delete or update
 * @param resource // profile, balance/..
 */
const grantAccess = (action, resource) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rol_name = req.query.role;
            const permission = role_middleware_1.default.can(rol_name)[action](resource);
            if (!permission.granted) {
                throw new error_response_1.AuthFailureError('you dont have enough permissions...');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = grantAccess;
