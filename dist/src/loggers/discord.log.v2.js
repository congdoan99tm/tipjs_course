"use strict";
//
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const token = process.env.TOKEN_DISCORD;
const chanelID = process.env.CHANNEL_ID_DISCORD;
class LoggerService {
    constructor() {
        this.stopBot = () => __awaiter(this, void 0, void 0, function* () {
            yield this.client.destroy(); // Đóng kết nối với Discord
            console.log('discord bot stop');
            process.exit();
        });
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.DirectMessages,
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
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
        const { code, message = 'This is some additional', title = 'Code Example', } = logData;
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
}
const loggerService = new LoggerService();
exports.default = loggerService;
