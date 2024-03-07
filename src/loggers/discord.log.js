// 'use strict'

// const { Client, GatewayIntentBits } = require('discord.js')
// const client = new Client({
//   intents: [
//     GatewayIntentBits.DirectMessages,
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//   ],
// })
// const token =
//   'MTE5NzgyNzU4NDI2MDU3NTMxNQ.Gp4-ag.fLlGlG8LBl6iYiKzT5OmBycycIHR2BGHdrV-GM'

// client.login(token)

// client.on('ready', () => {
//   console.log(`Logged is as ${client.user.tag}!`)
// })

// client.on('messageCreate', (msg) => {
//   console.log(msg)
//   if (msg.author.bot) return
//   if (msg.content === 'hi') {
//     msg.reply(`Xin chào đại ca`)
//   }
//   if (msg.content.toLowerCase() === 'stop') {
//     msg.reply('Bot sẽ dừng lại.')
//     client.destroy() // Đóng kết nối với Discord
//     // process.exit() // Tắt ứng dụng Node.js
//   }
// })

// module.exports = client
