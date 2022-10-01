// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../../utils/structures/BaseEvent');
const guilds = require('../../utils/database/models/guilds');
const { Client, Guild } = require('discord.js');

module.exports = class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildUpdate');
	}
	
	/**
	 * 
	 * @param {Client} client 
	 * @param {Guild} oldGuild 
	 * @param {Guild} newGuild 
	 */
	async run(client, oldGuild, newGuild) {
		try {
			const g = await guilds.findOneAndUpdate({
				guildId: oldGuild.id,
			}, {
				guildName: newGuild.name,
				guildIcon: newGuild.iconURL(),
				userCount: (await newGuild.members.fetch()).size
			});
			g.save();
		} catch(err) {}
	}
}