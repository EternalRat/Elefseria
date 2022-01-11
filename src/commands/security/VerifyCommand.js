const { Client, Message } = require('discord.js');
const blacklist = require('../../utils/database/models/blacklist');
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class VerifyCommand extends BaseCommand {
	constructor() {
		super('verify', 'security', [], 60, true, "Check every member on the guild", null, new PermissionGuard(["ADMINISTRATOR"]));
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} message 
	 * @param {Array} args 
	 */

	async run(client, message, args) {
		var guild = message.guild
		let people = new Array()
		let getLastKeyInMap = (map) => [...map][map.size-1][0];
		guild.members.fetch().then(members => {
			var findPeople = new Promise((resolve, reject) => {
				members.filter(member => !member.user.bot).forEach(async (member, key, map) => {
					let findBan = await blacklist.findOne({userId: member.id})
					if (findBan) people.push(member.user.username)
					if (getLastKeyInMap(map) === key) resolve();
				});
			});
			findPeople.then(() => {
				if (people.length === 0) return message.channel.send(`No one on this server is blacklist. You're safe.`)
				message.channel.send(`${people.join(', ')} ${people.length === 1 ? 'is' : 'are all'} blacklisted, be careful with ${people.length === 1 ? 'him' : 'them'}!`)
			});
		}).catch(err => console.log(err));
	}
}