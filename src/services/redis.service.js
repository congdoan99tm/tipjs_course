'use strict'

const redis = require('redis')
const { promisify } = require('util')
const {
  reservationInventory,
} = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pExpire = promisify(redisClient.pExpire).bind(redisClient)
const setNXAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (product_id, quantity, cartId) => {
  const key = `lock_v2023_${product_id}`
  const retryTimes = 10
  const expireTime = 3 // 3 seconds tam lock
  for (let i = 0; i < retryTimes.length; i++) {
    // tạo 1 key, ai nắm giữ được vào thanh toán
    const result = await setNXAsync(key, '')
    if (result === 1) {
      // thao tác với inventory
      const isReservation = await reservationInventory({
        product_id,
        quantity,
        cartId,
      })
      if (isReservation.matchedCount) {
        await pExpire(key, expireTime)
        return key
      }
      return null
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
