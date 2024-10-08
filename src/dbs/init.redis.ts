import Ioredis from 'ioredis';
import { RedisErrorResponse } from '../core/error.response';
import { setRedisCache } from '../models/repositories/cache.repo';

let clients = {};
const statusConnectRedis = {
  CONNECT: 'connect',
  END: 'end',
  RECONNECT: 'reconnect',
  ERROR: 'error',
};
let connectionTimeout;

const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: {
    vn: 'Redis lỗi rồi',
    en: 'Service connect error',
  },
};

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse(
      REDIS_CONNECT_MESSAGE.message.vn,
      REDIS_CONNECT_MESSAGE.code
    );
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnect = (connectionRedis, role, callback = null) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    if (callback && role === 'publisher') {
      callback();
    }
    console.log(`Redis ${role} - Connection status: connected`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.error(`Redis ${role} - Connection status: disconnected`);
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`Redis ${role} - Connection status: reconnecting`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.error(`Redis ${role} - Connection status: error ${err}`);
    handleTimeoutError();
  });
};

const initRedis = async ({
  IOREDIS_IS_ENABLE = true,
  IOREDIS_HOSTS = process.env.REDIS_CACHE_HOST,
  IOREDIS_PORT = 6379,
}) => {
  if (IOREDIS_IS_ENABLE) {
    const publisher = new Ioredis({
      host: IOREDIS_HOSTS,
      port: IOREDIS_PORT,
    });
    clients['publisher'] = publisher;
    handleEventConnect(publisher, 'publisher', setRedisCache);

    const subscriber = new Ioredis({
      host: IOREDIS_HOSTS,
      port: IOREDIS_PORT,
    });
    clients['subscriber'] = subscriber;
    handleEventConnect(subscriber, 'subscriber');
  }
};

const getPublisher = () => clients['publisher'];

const getSubscriber = () => clients['subscriber'];

const closeRedis = () => {
  if (clients['publisher']) {
    clients['publisher'].quit(() => {
      console.log('Redis publisher client connection closed');
    });
    delete clients['publisher'];
  } else {
    console.log('No Redis publisher client connection found to close');
  }

  if (clients['subscriber']) {
    clients['subscriber'].quit(() => {
      console.log('Redis subscriber client connection closed');
    });
    delete clients['subscriber'];
  } else {
    console.log('No Redis subscriber client connection found to close');
  }
};

export { initRedis, getPublisher, getSubscriber, closeRedis };
