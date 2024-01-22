const app = require('./src/app')
const port = process.env.DEV_APP_PORT || 3056
const discordBot = require('./src/loggers/discord.log.v2')

const server = app.listen(port, () => {
  console.log('app run on port:', port)
})

process.on('SIGINT', async () => {
  const { stopCheckOverloadDB } = require('./src/helpers/check.connect')
  const mongoose = require('mongoose')

  server.close(async () => {
    console.log(`app exit on port: ${port}`)

    // stopCheckOverloadDB();
    mongoose.disconnect()
    await discordBot.stopBot()

  })
})
