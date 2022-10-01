const BaseEvent = require('../../utils/structures/BaseEvent');
const { Client, GuildChannel } = require('discord.js');
const channels = require('../../utils/database/models/channels');

module.exports = class ChannelCreateEvent extends BaseEvent {
	constructor() {
		super('channelCreate');
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {GuildChannel} channel
	 */
	async run(client, channel) {
		const ch = await channels.findOne({guildId: channel.guild.id});
		if (!ch) return;
		const channelStat = ch.get('channelCountChannel');
		if (!channelStat) return;
		(await channel.guild.channels.fetch()).find(chan => chan.id === channelStat).setName(`Channel count : ${(await channel.guild.channels.fetch()).size}`);
	}
}