import amqp from 'amqplib';
const message = 'hello, RabbitMQ for Tipjs';

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true,
    });
    // send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`message sent: ${message}`);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
