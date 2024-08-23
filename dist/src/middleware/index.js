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
const discord_log_v2_1 = __importDefault(require("../loggers/discord.log.v2"));
const pushToLogDiscord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        discord_log_v2_1.default.sendToFormatCode({
            title: `method: ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originUrl}`,
        });
        console.log('send');
        return next();
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.default = pushToLogDiscord;
