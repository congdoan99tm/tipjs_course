'use strict'

const redis = require('redis')
const { promisify } = require('util')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (product_id, quantity, cartId) => {
  const key = `lock_v2023_${product_id}`
  const retryTimes = 10
  const expireTime = 3 // 3 seconds tam lock
  for (let i = 0; i < retryTimes.length; i++) {
    // tạo 1 key, ai nắm giữ được vào thanh toán
    const result = await setnxAsync(key, '')
    if (result === 1) {
      // thao tác với inventory
      return key
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}
module.exports = {
  acquireLock,
  releaseLock,
}
