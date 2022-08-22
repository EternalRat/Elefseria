const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed, Client, Message } = require("discord.js");
const PermissionGuard = require('../../utils/PermissionGuard');
const XP = require("../../utils/database/models/exp");

module.exports = class Remove extends BaseCommand {
	constructor() {
		super('removexp', 'leveling', ["remove", "remove-xp"], 3, true, "Remove a certain amount of experience to an user", "<amount> <user>", new PermissionGuard(["MANAGE_CHANNELS"]));
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array<String>} args 
	 * @returns 
	 */
	async run(client, msg, args) {
		const missingArgs = new MessageEmbed()
			.setTitle("Arguments missing")
			.setAuthor({
				"name": msg.author.username, 
				iconURL: msg.author.displayAvatarURL()
			})
			.setDescription(`\`${client.prefix}givexp <amount> <user>\``)
			.setFields([
				{
					name: "amount",
					value: "The amount of xp you'll remove."
				}, {
					name: "user",
					value: "The user who will loose experience."
				}
			]);
		if (!args.length) return msg.channel.send(missingArgs);
		var amount = parseInt(args[0]);
		let user = await msg.guild.members.fetch(msg.mentions.users.first() || args[1]);
		var userExp = await XP.findOne({
			userId: user.id,
			guildId: msg.guildId
		});
		userExp.set("exp", userExp.get("exp") - amount);
		const curLevel = Math.floor(0.1 * Math.sqrt(userExp.get("exp")));
		if (userExp.get("level") > curLevel) {
			userExp.set("level", curLevel);
			user.send({
				content: `Your level has been reduced by ${msg.author.username}. You're now level ${curLevel}.`
			});
		}
		userExp.save();
		msg.channel.send({content: `The user ${user.user.username} has lost ${amount}xp. He's now level ${curLevel}`});
	}
}