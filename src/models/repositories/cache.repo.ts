import { getPublisher, getSubscriber } from '../../dbs/init.redis';
import { logError } from '../../loggers/winston.log';
import Ioredis from 'ioredis';

let redisCache: Ioredis;

const setRedisCache = () => {
  redisCache = getSubscriber();
};

const setCache = async ({ key, value }) => {
  if (!redisCache) {
    throw new Error(`Redis client not initialized`);
  }
  try {
    return await redisCache.set(key, value);
  } catch (error) {
    logError(`${error}`);
    throw new Error(`${error.message}`);
  }
};

const setCacheExpiration = async ({ key, value, expirationInSeconds }) => {
  if (!redisCache) {
    throw new Error(`Redis client not initialized`);
  }
  try {
    return await redisCache.set(key, value, 'EX', expirationInSeconds);
  } catch (error) {
    logError(`${error}`);
    throw new Error(`${error.message}`);
  }
};

const getCache = async (key: string) => {
  if (!redisCache) {
    throw new Error(`Redis client not initialized`);
  }
  try {
    return await redisCache.get(key);
  } catch (error) {
    logError(`${error}`);
    throw new Error(`${error.message}`);
  }
};

export { setCache, setCacheExpiration, getCache, setRedisCache };
