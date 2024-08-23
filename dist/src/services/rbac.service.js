"use strict";
/**
 *  new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
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
exports.roleList = exports.createRole = exports.resourceList = exports.createResource = void 0;
const resource_model_1 = __importDefault(require("../models/resource.model"));
const role_model_1 = __importDefault(require("../models/role.model"));
const createResource = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name = 'product', slug = 'p01', description = '', }) {
    try {
        //1 check name or slug exists
        //2 new resource
        const resource = yield resource_model_1.default.create({
            src_name: name,
            src_slug: slug,
            src_description: description,
        });
        return resource;
    }
    catch (error) {
        return error;
    }
});
exports.createResource = createResource;
const resourceList = (_b) => __awaiter(void 0, [_b], void 0, function* ({ userId, limit = 30, offset = 0, search = '', }) {
    try {
        //1. check admin ? middleware function
        //2. get list of resource
        const resources = yield resource_model_1.default.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$src_name',
                    slug: '$src_slug',
                    description: '$src_description',
                    resourceId: '$_id',
                    createAt: 1,
                },
            },
        ]);
        return resources;
    }
    catch (error) {
        return [];
    }
});
exports.resourceList = resourceList;
const createRole = (_c) => __awaiter(void 0, [_c], void 0, function* ({ name = 'shop', slug = 's01', description = 'extend from shop or user', grants = [], }) {
    try {
        //1. check role exists
        //2. new role
        const role = yield role_model_1.default.create({
            rol_name: name,
            rol_slug: slug,
            rol_description: description,
            rol_grants: grants,
        });
        return role;
    }
    catch (error) {
        return error;
    }
});
exports.createRole = createRole;
const roleList = (_d) => __awaiter(void 0, [_d], void 0, function* ({ userId, limit = 30, offset = 0, search = '' }) {
    try {
    }
    catch (error) { }
});
exports.roleList = roleList;
