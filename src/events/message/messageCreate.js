const BaseEvent = require('../../utils/structures/BaseEvent');
const { Client, Message } = require('discord.js');
const BaseModule = require('../../utils/structures/BaseModule');

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
			for (var mod of client.modules) {
				if (!mod.isAModuleCommand(cmdName))
					continue;
				let isThisModuleEnabled = await mod.isThisModuleEnabled(message.guild.id);
				if (!isThisModuleEnabled) {
					message.channel.send(`Le module \`${mod.name}\` n'est pas activé !`);
					return;
				}
				mod.runCommand(cmdName, client, message, cmdArgs);
				return;
			}
		}
	}
}