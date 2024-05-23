'use strict';

import rabbitMQ from '../dbs/init.rabbit.js';

describe('RabbitMQ Connection', () => {
  it('should connect to RabbitMQ without errors', async () => {
    await expect(async () => {
      await rabbitMQ.connectToRabbitMQForTest();
    }).toThrow();
  });
});
