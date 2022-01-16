const BaseEvent = require('../../utils/structures/BaseEvent');
const db = require("../../utils/database/database");
const { Client } = require('discord.js');
const fs = require("fs")
const ModuleConfig = require("../../utils/database/models/moduleconfig");
const guildInvites = require('../../utils/database/models/guildInvites');

module.exports = class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}

	/**
	 * 
	 * @param {Client} client 
	 */
	async run (client) {
		console.log(client.user.tag + ' has logged in.');
		client.user.setPresence({ activities: [{ name: 'Elefseria On Top', type: 'STREAMING', url: "https://twitch.tv/eternalrat" }] });
		(await client.guilds.fetch()).forEach(clientGuild => {
			clientGuild.fetch().then(guild => {
				guild.invites.fetch().then(async invites => {
					const invMap = new Map();
					invites.forEach((inv) => {
						invMap.set(inv.code, {
							userId: inv.inviter.id,
							uses: inv.uses,
							temp: inv.temporary,
							expires: inv.temporary ? inv.expiresTimestamp : -1
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