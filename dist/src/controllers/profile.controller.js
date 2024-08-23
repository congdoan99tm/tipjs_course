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
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../core/success.response");
const dataProfiles = [
    {
        usr_id: 1,
        usr_name: 'CR7',
        usr_avt: 'image.com/user/1',
    },
    {
        usr_id: 2,
        usr_name: 'M10',
        usr_avt: 'image.com/user/2',
    },
    {
        usr_id: 3,
        usr_name: 'doan',
        usr_avt: 'image.com/user/3',
    },
];
class ProfileController {
    constructor() {
        // admin
        this.profiles = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'view all profiles',
                metadata: dataProfiles,
            }).send(res);
        });
        //shop
        this.profile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new success_response_1.SuccessResponse({
                message: 'view one profile',
                metadata: {
                    usr_id: 2,
                    usr_name: 'M10',
                    usr_avt: 'image.com/user/2',
                },
            }).send(res);
        });
    }
}
exports.default = new ProfileController();
