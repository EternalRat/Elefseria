const BaseEvent = require('../../utils/structures/BaseEvent');
const db = require("../../utils/database/database");
const { Client } = require('discord.js');
const fs = require("fs")
const ModuleConfig = require("../../utils/database/models/moduleconfig");
const guildInvites = require('../../utils/database/models/guildInvites');
const channels = require('../../utils/database/models/channels');
const config = require('../../utils/database/models/config');
const moduleconfig = require('../../utils/database/models/moduleconfig');
const guilds = require('../../utils/database/models/guilds');

module.exports = class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}

	/**
	 * 
	 * @param {Client} client 
	 */
	async run(client) {
		console.log(client.user.tag + ' has logged in.');
		var i = 0;
		setInterval(() => {
			const status = ['Elefseria v0.1', `Watching over ${client.guilds.cache.size} servers`, 'Elefseria Beta'];
			client.user.setPresence({ activities: [{ name: status[i], type: 'STREAMING', url: "https://twitch.tv/" }] });
			i++;
			if (i >= status.length)
				i = 0;
		}, 60000);
		(await client.guilds.fetch()).forEach(clientGuild => {
			clientGuild.fetch().then(async guild => {
				/*for (var mod of client.modules) {
					guild.commands.set(mod.commands)
				}*/
				try {
					if (!(await config.findOne({guildId: guild.id}))) {
						let guildConfig = await config.create({
							guildId: guild.id,
							raidmode: false,
							blacklist: false,
							time: 10,
							people: 5
						});
						guildConfig.save();
					}
					if (!(await channels.findOne({guildId: guild.id}))) {
						const gChannels = await channels.create({
							joinMsgDM: false,
							channelJoin: undefined,
							joinMsg: undefined,
							channelLeft: undefined,
							leftMsg: undefined,
							memberCountChannel: undefined,
							userCountChannel: undefined,
							botCountChannel: undefined,
							roleCountChannel: undefined,
							channelCountChannel: undefined,
							inviteLog: undefined,
							inviteMsg: undefined,
							msgLog: undefined,
							voiceLog: undefined,
							normalVoice: undefined,
							premiumVoice: undefined,
							betaVoice: undefined,
							guildId: guild.id
						})
						gChannels.save();
					}
					if (!(moduleconfig.findOne({guildId: guild.id}))) {
						let guildModuleConfig = await moduleconfig.create({
							guildId: guild.id,
							funState: true,
							giveawayState: true,
							moderationState: true,
							reactionRoleState: true,
							securityState: true,
							settingsState: true,
							ticketState: true,
							voiceState: false,
							levelingState: true
						});
						guildModuleConfig.save();
					}
					const g = await guilds.create({
						guildName: guild.name,
						guildId: guild.id,
						guildIcon: guild.iconURL(),
						userCount: (await guild.members.fetch()).size
					});
					g.save();
				} catch(err) {}
				guild.invites.fetch().then(async invites => {
					const invMap = new Map();
					invites.forEach((inv) => {
						invMap.set(inv.code, {
							userId: inv.inviter.id,
							uses: inv.uses,
							temp: inv.temporary,
							expires: inv.maxAge > 0 ? inv.expiresTimestamp : -1
						});
					});
					let guildInvite = await guildInvites.findOneAndUpdate({
						guildId: guild.id
					}, {
						invites: invMap
					});
					if (!guildInvite) {
						guildInvite = await guildInvites.create({
							guildId: guild.id,
							invites: invMap
						});
					}
					guildInvite.save();
				});
			});
		});
		setInterval(async () => {
			for (let i in client.mutes) {
				let isInfinite = client.mutes[i].infinite;
				let time = client.mutes[i].time;
				let guildID = client.mutes[i].guild;
				let guild = await client.guilds.fetch(guildID);
				if (isInfinite === true)
					continue;
				let member = await guild.members.fetch(i);
				if (!member) {
					delete client.mutes[i];
					fs.writeFile("./src/utils/json/mute.json", JSON.stringify(client.mutes), err => {
						if (err) throw err;
					});
				}
				let mutedRole = guild.roles.cache.find(r => r.name === "Muted");
				if (!mutedRole) continue;
				if (Date.now() > time) {
					console.log(`${i} is now able to be unmuted!`);
					member.roles.remove(mutedRole);
					delete client.mutes[i];
					fs.writeFile("./src/utils/json/mute.json", JSON.stringify(client.mutes), err => {
						if (err) throw err;
						console.log(`I have unmuted ${member.user.tag}.`);
					});
				}
			}
		}, 5000);
	}
}