// 'use strict'

import { Client, GatewayIntentBits } from 'discord.js';
const token: string =
  'MTE5NzgyNzU4NDI2MDU3NTMxNQ.GS1mDJ.dIMbkV4JD5VpOJX2mfMJ2OWLywbgmQ6Zc8cawY';
const chanelID: string = '1197831102413422625';
class LoggerService {
  client: any;
  chanelId: string;
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // add chanelID
    this.chanelId = chanelID;

    this.client.on('ready', () => {
      const channel = this.client.channels.cache.get(this.chanelId);
      if (!channel) {
        console.error(`Couldn't find the channel..`, this.chanelId);
        return;
      }
      console.log(`Logged is as ${this.client.user.tag}!`);
    });
    this.client.login(token);
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = 'This is some additional',
      title = 'Code Example',
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
        },
      ],
    };
    this.sendToMessage(`${codeMessage}`);
  }

  sendToMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.chanelId);
    if (!channel) {
      console.error(`Couldn't find the channel..`, this.chanelId);
      return;
    }
    channel.send(message).catch((e) => console.error(e));
  }
  stopBot = async () => {
    await this.client.destroy(); // Đóng kết nối với Discord
    console.log('discord bot stop');
    process.exit();
  };
}

const loggerService = new LoggerService();

export default loggerService;
