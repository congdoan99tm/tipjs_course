"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopCheckOverloadDB = exports.checkOverloadDB = exports.countConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const os_1 = __importDefault(require("os"));
const _SECONDS = 5000;
const countConnect = () => {
    const numConnection = mongoose_1.default.connections.length;
    return `Number of connections : ${numConnection}`;
};
exports.countConnect = countConnect;
let intervalId;
const checkOverloadDB = () => {
    intervalId = setInterval(() => {
        const numConnection = mongoose_1.default.connections.length;
        const numCores = os_1.default.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;
        console.log(`Active connections: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        if (numConnection > maxConnections) {
            console.log(`Connection overload detected!`);
        }
    }, _SECONDS); // Monitor every 5 seconds
};
exports.checkOverloadDB = checkOverloadDB;
const stopCheckOverloadDB = () => {
    clearInterval(intervalId);
    console.log('Stop Check OverloadDB');
};
exports.stopCheckOverloadDB = stopCheckOverloadDB;
