const BaseEvent = require('../../utils/structures/BaseEvent');
const db = require("../../utils/database/database");
const { Client } = require('discord.js');
const fs = require("fs")
const ModuleConfig = require("../../utils/database/models/moduleconfig");

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
		client.user.setActivity("Elefseria On Top", { type: 'STREAMING' });
		setInterval(async () => {
			for (let i in client.mutes) {
				let time = client.mutes[i].time
				let guildID = client.mutes[i].guild
				let guild = await client.guilds.fetch(guildID)
				if (!guild.members.cache.has(i)) {
					delete client.mutes[i]
					fs.writeFile("./src/utils/json/mute.json", JSON.stringify(client.mutes), err => {
						if (err) throw err
					})
				}
				let member = await guild.members.fetch(i)
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