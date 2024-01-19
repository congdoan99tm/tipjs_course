'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.on('ready', () => {
  console.log(`Logged is as ${client.user.tag}!`)
})
const token =
  'MTE5NzgzMDIyNjE3Mjk4NTQ2NA.GV48JV.rWtfXxP2XLa4hClccL33R85QCCWLVbsQ3MI5Do'
client.login(token)

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return
  if (msg.content === 'hi') {
    msg.reply(`Xin chào đại ca`)
  }
  if (msg.content.toLowerCase() === 'stop') {
    msg.reply('Bot sẽ dừng lại.')
    client.destroy() // Đóng kết nối với Discord
    // process.exit() // Tắt ứng dụng Node.js
  }
})

module.exports = client
