const BaseEvent = require('../../utils/structures/BaseEvent');
const { Client, Role } = require('discord.js');
const channels = require('../../utils/database/models/channels');

module.exports = class RoleDeleteEvent extends BaseEvent {
	constructor() {
		super('roleDelete');
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Role} role
	 */
	async run(client, role) {
		const ch = await channels.findOne({guildId: role.guild.id});
		if (!ch) return;
		const channelStat = ch.get('roleCountChannel');
		if (!channelStat) return;
		(await role.guild.channels.fetch()).find(chan => chan.id === channelStat).setName(`Role count : ${(await role.guild.roles.fetch()).size}`);
	}
}