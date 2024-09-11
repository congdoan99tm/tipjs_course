import Ioredis from 'ioredis';
import { promisify } from 'util';
import InventoryRepo from '../models/repositories/inventory.repo';
import inventoryRepo from '../models/repositories/inventory.repo';
import { getRedis } from '../dbs/init.redis';

// const redisClient = new Ioredis({
//   host: '127.0.0.1',
//   port: 6379,
// });
const redisClient = getRedis();

// const pExpire = promisify(redisClient.pexpire).bind(redisClient);
// const setNXAsync = promisify(redisClient.setnx).bind(redisClient);
// const delAsyncKey = promisify(redisClient.del).bind(redisClient);

const acquireLock = async ({ productId, quantity, cartId }) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3; // 3 seconds tam lock

  for (let i = 0; i < retryTimes; i++) {
    // tạo 1 key, ai nắm giữ được vào thanh toán
    const result = await redisClient.setnx(key, '');
    if (result === 1) {
      // thao tác với inventory
      const isReservation = await inventoryRepo.reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.matchedCount) {
        await redisClient.pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  return await redisClient.del(keyLock);
};

export default {
  acquireLock,
  releaseLock,
};
