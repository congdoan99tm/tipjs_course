import app from './src/app';
import mongoose from 'mongoose';
// import os from 'os';
const port = process.env.DEV_APP_PORT || 3052;

// const discordBot = require('./src/loggers/discord.log.v2')
// thiết lập số core chạy dựa trên cấu hình máy tính
// process.env.UV_THREADPOOL_SIZE = (os.cpus().length -1).toString();

const server = app.listen(port, () => {
  console.log('app run on port:', port);
});

let isExiting: boolean = false;

process.on('SIGINT', async () => {
  if (isExiting) {
    return;
  }

  isExiting = true;

  server.close(async () => {
    console.log(`app exit on port: ${port}`);

    // stopCheckOverloadDB();
    mongoose.disconnect();
    // await discordBot.stopBot();

    process.exit(0); // Chấm dứt quá trình Node.js khi đã hoàn tất các hành động cleanup
  });
});
