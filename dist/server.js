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
const app_1 = __importDefault(require("./src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
// import os from 'os';
const port = process.env.DEV_APP_PORT || 3052;
// const discordBot = require('./src/loggers/discord.log.v2')
// thiết lập số core chạy dựa trên cấu hình máy tính
// process.env.UV_THREADPOOL_SIZE = (os.cpus().length -1).toString();
const server = app_1.default.listen(port, () => {
    console.log('app run on port:', port);
});
let isExiting = false;
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    if (isExiting) {
        return;
    }
    isExiting = true;
    server.close(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`app exit on port: ${port}`);
        // stopCheckOverloadDB();
        mongoose_1.default.disconnect();
        // await discordBot.stopBot();
        process.exit(0); // Chấm dứt quá trình Node.js khi đã hoàn tất các hành động cleanup
    }));
}));
