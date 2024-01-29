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

const Ioredis = require('ioredis')

class RedisPubSubService {
  constructor() {
    this.subscriber = new Ioredis()
    this.publisher = new Ioredis()

    this.subscriber.on('connect', () => {
      console.log('Connected to Redis')
    })
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err)
        } else {
          resolve(reply)
        }
      })
    })
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel)
    this.subscriber.on('message', (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(subscriberChannel,message)
      }
    })
  }
}

module.exports = new RedisPubSubService()
