import Ioredis from 'ioredis';
import { RedisErrorResponse } from '../core/error.response';

let client = {},
  statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnect',
    ERROR: 'error',
  },
  connectionTimeout;
const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: 'Redis loi roi',
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

const handleEventConnect = (connectionRedis: Ioredis) => {
  // check if connection is null
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`connectionRedis - Connection status: connected`);
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.error(`connectionRedis - Connection status: disConnected`);
    // connect retry
    handleTimeoutError();
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`connectionRedis - Connection status: reConnecting`);
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.error(`connectionRedis - Connection status: error ${err}`);
    handleTimeoutError();
  });
};

const initRedis = () => {
  const instanceRedis: Ioredis = new Ioredis();
  client['instanceConnect'] = instanceRedis;
  handleEventConnect(instanceRedis);
};

const getRedis = (): Ioredis => client['instanceConnect'];
const closeRedis = () => {
  if (client['instanceConnect']) {
    client['instanceConnect'].quit(() => {
      console.log('Redis client connection closed');
    });
    delete client['instanceConnect']; // Xóa instance sau khi đóng kết nối
  } else {
    console.log('No Redis client connection found to close');
  }
};

class RedisClient {
  public redisClient?: Ioredis;

  constructor(redisClient?: Ioredis) {
    this.redisClient = redisClient;
  }
}
export { initRedis, getRedis, closeRedis, handleTimeoutError };
