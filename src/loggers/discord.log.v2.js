// 'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const token =
  'MTE5NzgyNzU4NDI2MDU3NTMxNQ.Gj_y6Z.i7ODqgBtRKLe_8P_FqGNe4r43Zs_KXK6ipFcFw'

const chanelID = '1197831102413422625'
class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    })

    // add chanelID
    this.chanelId = chanelID

    this.client.on('ready', () => {
      const channel = this.client.channels.cache.get(this.chanelId)
      if (!channel) {
        console.error(`Couldn't find the channel..`, this.chanelId)
        return
      }
      console.log(`Logged is as ${this.client.user.tag}!`)
    })
    this.client.login(token)
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = 'This is some additional',
      title = 'Code Example',
    } = logData

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
        },
      ],
    }
    this.sendToMessage(codeMessage)
  }

  sendToMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.chanelId)
    if (!channel) {
      console.error(`Couldn't find the channel..`, this.chanelId)
      return
    }
    channel.send(message).catch((e) => console.error(e))
  }
  stopBot = async () => {
    await this.client.destroy() // Đóng kết nối với Discord
    console.log('discord bot stop')
    process.exit()
  }
}

const loggerService = new LoggerService()

module.exports = loggerService
