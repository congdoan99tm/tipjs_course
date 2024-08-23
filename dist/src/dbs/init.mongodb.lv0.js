"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectString = 'mongodb://redis://redis::27018/shopDEV';
mongoose_1.default
    .connect(connectString)
    .then((_) => console.log(`Connected Mongoose Success`))
    .catch((err) => console.log(`Error connect Mongoose: ${err}`));
// Dev
if (1 === 1) {
    mongoose_1.default.set('debug', true);
    mongoose_1.default.set('debug', { color: true });
}
exports.default = mongoose_1.default;
