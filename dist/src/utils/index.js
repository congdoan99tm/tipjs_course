"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequiredFields = exports.convertToObjectIdMongodb = exports.updateNestedObjectParser = exports.removeUndefinedObject = exports.unGetSelectData = exports.getSelectData = exports.getInfoData = void 0;
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const error_response_1 = require("../core/error.response");
const convertToObjectIdMongodb = (Id) => new mongoose_1.Types.ObjectId(Id);
exports.convertToObjectIdMongodb = convertToObjectIdMongodb;
const getInfoData = ({ fields = [], object = {} }) => {
    return lodash_1.default.pick(object, fields);
};
exports.getInfoData = getInfoData;
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};
exports.getSelectData = getSelectData;
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};
exports.unGetSelectData = unGetSelectData;
// Bảo toàn dữ liệu, tránh mất dữ liệu khi req = null
const removeUndefinedObject = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    Object.keys(obj).forEach((key) => {
        obj[key] = removeUndefinedObject(obj[key]);
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
};
exports.removeUndefinedObject = removeUndefinedObject;
/// Update , giữ các data cũ.( $set{bodyUpdate})
const updateNestedObjectParser = (obj) => {
    // if (obj === null || obj === undefined) return obj;
    const final = {};
    Object.keys(obj).forEach((k) => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            // if(response === null) return
            Object.keys(response).forEach((a) => {
                final[`${k}.${a}`] = response[a];
            });
        }
        else {
            final[k] = obj[k];
        }
    });
    console.log(final);
    return final;
};
exports.updateNestedObjectParser = updateNestedObjectParser;
const checkRequiredFields = (payload, requiredFields) => {
    const missingFields = requiredFields.filter((field) => !(field in payload));
    if (missingFields.length > 0) {
        const errorMessage = `Thiếu các trường bắt buộc: ${missingFields.join(', ')}`;
        throw new error_response_1.BadRequestError(errorMessage);
    }
};
exports.checkRequiredFields = checkRequiredFields;
