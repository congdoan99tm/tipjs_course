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
const discount_service_1 = __importDefault(require("../services/discount.service"));
const success_response_1 = require("../core/success.response");
class DiscountController {
    constructor() {
        this.createDiscountCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Successful Code Generations',
                metadata: yield discount_service_1.default.createDiscountCode(Object.assign(Object.assign({}, req.body), { shopId: req.user.userId })),
            }).send(res);
        });
        this.getAllDiscountCodes = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Successful Code Found',
                metadata: yield discount_service_1.default.getAllDiscountCodesByShop(Object.assign(Object.assign({}, req.query), { shopId: req.user.userId })),
            }).send(res);
        });
        this.getDiscountAmount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Successful Code Found',
                metadata: yield discount_service_1.default.getDiscountAmount(Object.assign({}, req.body)),
            }).send(res);
        });
        this.getAllDiscountCodesWithProducts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'Successful Code Found',
                metadata: yield discount_service_1.default.getAllDiscountCodesWithProduct(Object.assign({}, req.query)),
            }).send(res);
        });
    }
}
exports.default = new DiscountController();
