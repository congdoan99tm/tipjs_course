"use strict";
// const Redis = require('redis')
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// class RedisPubSubService {
//   constructor() {
//     this.subscriber = Redis.createClient({ legacyMode: true })
//     this.publisher = Redis.createClient({ legacyMode: true })
//     this.subscriber.on('connect', () => {
//       console.log('Connected to Redis')
//     })
//   }
//   async publish(channel, message) {
//     return new Promise((resolve, reject) => {
//       this.publisher.publish(channel, message, (err, reply) => {
//         if (err) {
//           reject(err)
//         } else {
//           resolve(reply)
//         }
//       })
//     })
//   }
//   subscribe(channel, callback) {
//     this.subscriber.subscribe(channel)
//     this.subscriber.on('message', (subscriberChannel, message) => {
//       if (channel === subscriberChannel) {
//         callback(channel)
//       }
//     })
//   }
// }
// module.exports = new RedisPubSubService()
const ioredis_1 = __importDefault(require("ioredis"));
class RedisPubSubService {
    constructor() {
        this.subscriber = new ioredis_1.default({
            host: '127.0.0.1',
            port: 6379,
        });
        this.publisher = new ioredis_1.default({
            host: '127.0.0.1',
            port: 6379,
        });
        this.subscriber.on('connect', () => {
            console.log('Connected to Redis');
        });
    }
    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(reply);
                }
            });
        });
    }
    subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on('message', (subscriberChannel, message) => {
            if (channel === subscriberChannel) {
                callback(subscriberChannel, message);
            }
        });
    }
}
exports.default = new RedisPubSubService();
