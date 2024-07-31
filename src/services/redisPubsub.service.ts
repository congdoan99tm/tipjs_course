// const Redis = require('redis')

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

import Ioredis from 'ioredis';

class RedisPubSubService {
  subscriber: Ioredis;
  publisher: Ioredis;
  constructor() {
    this.subscriber = new Ioredis({
      host: '127.0.0.1',
      port: 6379,
    });
    this.publisher = new Ioredis({
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
        } else {
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

export default new RedisPubSubService();
