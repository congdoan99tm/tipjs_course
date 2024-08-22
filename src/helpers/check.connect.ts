import mongoose from 'mongoose';
import os from 'os';

const _SECONDS = 5000;

const countConnect = (): string => {
  const numConnection = mongoose.connections.length;
  return `Number of connections : ${numConnection}`;
};

let intervalId: NodeJS.Timeout;

const checkOverloadDB = (): void => {
  intervalId = setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, _SECONDS); // Monitor every 5 seconds
};

const stopCheckOverloadDB = (): void => {
  clearInterval(intervalId);
  console.log('Stop Check OverloadDB');
};

export { countConnect, checkOverloadDB, stopCheckOverloadDB };
