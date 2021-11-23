const BaseEvent = require('../../utils/structures/BaseEvent');
const { Client, Message } = require('discord.js');

module.exports = class MessageEvent extends BaseEvent {
	constructor() {
		super('messageCreate');
	}

	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 */
	async run(client, message) {
		if (message.author.bot) return;
		if (message.content.startsWith(client.prefix)) {
			const [cmdName, ...cmdArgs] = message.content.slice(client.prefix.length).trim().split(/\s+/);
			for (var module of client.modules) {
				if (!module.isAModuleCommand(cmdName))
					continue;
				let isThisModuleEnabled = await module.isThisModuleEnabled(message.guild.id);
				if (!isThisModuleEnabled) {
					message.channel.send(`Le module \`${module.name}\` n'est pas activé !`);
					return;
				}
				module.runCommand(cmdName, client, message, cmdArgs);
				return;
			}
		}
	}
}