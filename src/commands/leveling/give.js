const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed, Client, Message } = require("discord.js");
const PermissionGuard = require('../../utils/PermissionGuard');
const XP = require("../../utils/database/models/exp");

module.exports = class Give extends BaseCommand {
	constructor() {
		super('givexp', 'leveling', ["give", "give-xp"], 3, true, "Give a certain amount of experience to an user", "<amount> <user>", new PermissionGuard(["MANAGE_CHANNELS"]));
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
				"iconURL": msg.author.displayAvatarURL()
			})
			.setDescription(`\`${client.prefix}givexp <amount> <user>\``)
			.setFields([
				{
					name: "amount",
					value: "The amount of xp you'll give."
				}, {
					name: "user",
					value: "The user who will receive experience."
				}
			]);
		if (!args.length) return msg.channel.send({embeds: [missingArgs]});
		var amount = parseInt(args[0]);
		let target = await msg.guild.members.fetch(msg.mentions.users.first() || args[1]);
		if (!target) return;
		var userExp = await XP.findOne({
			userId: target.id,
			guildId: msg.guildId
		});
		if (!userExp) {
			userExp = await XP.create({
				userId: target.id,
				guildId: msg.guildId,
				exp: 0,
				level: 0,
				lastDateMessage: new Date()
			});
		}
		userExp.set("exp", userExp.get("exp") + amount);
		const curLevel = Math.floor(0.1 * Math.sqrt(userExp.get("exp")));
		if (userExp.get("level") < curLevel) {
			userExp.set("level", curLevel);
			target.send({
				content: `Your level has been increased by ${msg.author.username}. You're now level ${curLevel}.`
			});
		}
		userExp.save();
		msg.channel.send({content: `The user ${target.user.username} received ${amount}xp. He's now level ${curLevel}`});
	}
}