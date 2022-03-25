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
		client.user.setPresence({ activities: [{ name: 'Elefseria On Top', type: 'STREAMING', url: "https://twitch.tv/eternalrat" }] });
		(await client.guilds.fetch()).forEach(clientGuild => {
			clientGuild.fetch().then(async guild => {
				try {
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
					const guildInvite = await guildInvites.findOneAndUpdate({
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
				let isInfinite = client.mutes[i].infinite
				let time = client.mutes[i].time
				let guildID = client.mutes[i].guild
				let guild = await client.guilds.fetch(guildID)
				if (isInfinite === true)
					continue;
				let member = await guild.members.fetch(i)
				if (!member) {
					delete client.mutes[i]
					fs.writeFile("./src/utils/json/mute.json", JSON.stringify(client.mutes), err => {
						if (err) throw err
					})
				}
				let mutedRole = guild.roles.cache.find(r => r.name === "Muted")
				if (!mutedRole) continue
				if (Date.now() > time) {
					console.log(`${i} is now able to be unmuted!`)
					member.roles.remove(mutedRole)
					delete client.mutes[i]
					fs.writeFile("./src/utils/json/mute.json", JSON.stringify(client.mutes), err => {
						if (err) throw err
						console.log(`I have unmuted ${member.user.tag}.`)
					})
				}
			}
		}, 5000)
	}
}