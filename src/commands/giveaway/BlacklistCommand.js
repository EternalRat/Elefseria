const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed, Client, Message } = require("discord.js")
const PermissionGuard = require('../../utils/PermissionGuard');
const GUserBlacklist = require('../../utils/database/models/giveawayblacklist');

module.exports = class CreateCommand extends BaseCommand {
	constructor() {
		super('gwblacklist', 'giveaway', ["blacklist-giveaway", "blacklistgw"], 3, true, "Blacklist someone for giveaways", "<add/remove> <user/userId> [reason]", new PermissionGuard(["MANAGE_CHANNELS"]));
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array<String>} args 
	 * @returns 
	 */
	async run(client, msg, args) {
		if (args.length === 0) return;
		if (msg.mentions.users.length === 0) return;
		try {
			if (args[0].toLowerCase() === "add") {
				if (args.length < 3) {
					msg.channel.send("You must give us at least 3 arguments. <add/remove> <user/userId> <reason>");
					return 1;
				}
				await addBlacklistGiveaway(args, msg);
				msg.channel.send("Successfully added this user to the blacklist.");
			} else if (args[0].toLowerCase() === "remove") {
				if (args.length < 2) {
					msg.channel.send("You must give us at least 2 arguments. <add/remove> <user/userId>");
					return 1;
				}
				await removeBlacklistGiveaway(args, msg);
				msg.channel.send("Successfully removed this user from the blacklist.");
			}
		} catch (err) {
			msg.channel.send("Something wrong occured. Please try again in a few seconds...");
		}
		return 0;
	}
}

/**
 * @param {Message} message
 * @param {Array<String>} args
 */
async function addBlacklistGiveaway(args, message) {
	let user = await message.guild.members.fetch(message.mentions.users.first() || args[1]);
	let reason = args.slice(2).join(' ');
	if (!user || !reason) return;
	let blacklistedUsers = await GUserBlacklist.findOne({guildId: message.guild.id});
	if (!blacklistedUsers) {
		blacklistedUsers = new GUserBlacklist({
			guildId: message.guild.id,
			users: new Array({
				id: user.id,
				reason: reason
			})
		});
		blacklistedUsers.save();
	} else {
		let blacklist = blacklistedUsers.get('users');
		blacklist.push({
			id: user.id,
			reason: reason
		});
		blacklistedUsers.set('users', blacklist);
		blacklistedUsers.save();
	}
}

/**
 * @param {Message} message
 * @param {Array<String>} args
 */
async function removeBlacklistGiveaway(args, message) {
	let user = await message.guild.members.fetch(message.mentions.users.first() || args[1]);
	if (!user) return;
	let blacklistedUsers = await GUserBlacklist.findOne({guildId: message.guild.id});
	if (!blacklistedUsers) {
		message.channel.send("There's no blacklist in this server.");
	} else {
		let blacklist = blacklistedUsers.get('users').filter((obj) => {
			return obj.id !== user.id;
		});
		blacklistedUsers.set('users', blacklist);
		blacklistedUsers.save();
	}
}