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
const amqplib_1 = __importDefault(require("amqplib"));
const message = 'hello, RabbitMQ for Tipjs';
const runConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect('amqp://guest:guest@localhost');
        const channel = yield connection.createChannel();
        const queueName = 'test-topic';
        yield channel.assertQueue(queueName, {
            durable: true,
        });
        // listen messages from producer channel
        channel.consume(queueName, (message) => {
            console.log(`Received ${message.content.toString()}`);
        }, {
            noAck: true,
        });
    }
    catch (error) {
        console.error(error);
    }
});
runConsumer().catch(console.error);
