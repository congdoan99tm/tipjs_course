const app = require('./src/app');
const port = process.env.DEV_APP_PORT || 3052;
// const discordBot = require('./src/loggers/discord.log.v2')

const server = app.listen(port, () => {
  console.log('app run on port:', port);
});

let isExiting = false;

process.on('SIGINT', async () => {
  if (isExiting) {
    return;
  }

  isExiting = true;

  const mongoose = require('mongoose');

  server.close(async () => {
    console.log(`app exit on port: ${port}`);

    // stopCheckOverloadDB();
    mongoose.disconnect();
    // await discordBot.stopBot();

    process.exit(0); // Chấm dứt quá trình Node.js khi đã hoàn tất các hành động cleanup
  });
});
