require('dotenv').config();
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const WarnModel = require("../../utils/database/models/warn");
const { MessageEmbed, Message, Client } = require("discord.js");

module.exports = class DelwarnCommand extends BaseCommand {
	constructor() {
		super('delwarn', 'moderation', ["dw", "delete"], 5, true, "Delete warning of an user", "<warningId>", new PermissionGuard(["MANAGE_MESSAGES"]));
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array} args 
	 */
	async run(client, msg, args) {
		var embedColor = '#ffffff';
		var missingArgsEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.setTitle("Missing arguments")
			.setDescription(`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``)
			.setTimestamp();
		if (args.length !== 1) {
			msg.channel.send({embeds: [missingArgsEmbed]});
			return;
		}
		let warnId = `${args[0]}`;
		let allUser = await WarnModel.find({ guildId: msg.guild.id });
		let finaluser;
		for (const user of allUser) {
			if (user.Reason.get(warnId)) {
				finaluser = await WarnModel.findOne(user);
				break;
			}
		}
		if (!finaluser)
			return msg.channel.send("This warnId has any correspondance");
		let userId = finaluser.get("userId");
		let guildId = finaluser.get("guildId");
		let Count = finaluser.get("Count");
		Count--;
		let Reason = new Map();
		let loop = 1;
		let i = 0;
		finaluser.Reason.forEach((key, value) => {
			if (value === warnId)
				loop = 0;
			else if (value !== warnId)
				Reason.set(value, key);
			if (loop === 1)
				i++;
		});
		let userTag = new Array()
		finaluser.userTag.forEach(value => {
			userTag.push(value);
		});
		userTag.splice(i, 1);
		await finaluser.deleteOne();
		let newUser = new WarnModel({
				userId,
				guildId,
				Count,
				Reason,
				userTag
		});
		newUser.save().catch(err=>console.log(err));
		msg.channel.send("👌");
	}
}