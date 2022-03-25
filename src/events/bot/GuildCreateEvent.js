// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../../utils/structures/BaseEvent');
const guildInvites = require('../../utils/database/models/guildInvites');
const channels = require('../../utils/database/models/channels');
const config = require('../../utils/database/models/config');
const moduleconfig = require('../../utils/database/models/moduleconfig');
const guilds = require('../../utils/database/models/guilds');
const { Client, Guild } = require('discord.js');

module.exports = class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildCreate');
	}
	
	/**
	 * 
	 * @param {Client} client 
	 * @param {Guild} guild 
	 */
	async run(client, guild) {
		try {
			let guildInvite = await guildInvites.create({ guildId: guild.id });
			guildInvite.save();
		} catch(err) {}
		try {
			let chan = await channels.create({ guildId: guild.id });
			chan.save();
		} catch(err) {}
		try {
			let guildConfig = await config.create({
				guildId: guild.id,
				raidmode: false,
				blacklist: false,
				time: 10,
				people: 5
			});
			guildConfig.save();
		} catch(err) {}
		try {
			let guildModuleConfig = await moduleconfig.create({
				guildId: guild.id,
				funState: true,
				giveawayState: true,
				moderationState: true,
				reactionRoleState: true,
				securityState: true,
				settingsState: true,
				ticketState: true,
				voiceState: true,
				levelingState: true
			});
			guildModuleConfig.save();
		} catch(err) {}
		try {
			const g = await guilds.create({
				guildId: guild.id,
				guildName: guild.name,
				guildIcon: guild.iconURL(),
				userCount: (await guild.members.fetch()).size
			});
			g.save();
		} catch(err) {}
		try {
			const g = await channels.create({
				guildId: guild.id,
				channelJoin: undefined,
				channelLeft: undefined,
				userCountChannel: undefined,
				memberCountChannel: undefined,
				botCountChannel: undefined,
				roleCountChannel: undefined,
				channelCountChannel: undefined,
				inviteLog: undefined,
				msgLog: undefined,
				channelLog: undefined,
				normalVoice: undefined,
				premiumVoice: undefined,
				betaVoice: undefined
			});
			g.save();
		} catch(err) {}
	}
}