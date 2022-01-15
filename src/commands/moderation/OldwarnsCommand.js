const { Seewarn } = require('../../utils/seewarn');
require('dotenv').config();
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const WarnModel = require("../../utils/database/models/warn");
const OldWarnModel = require("../../utils/database/models/oldwarnmodel");
const { MessageEmbed, Message, Client } = require("discord.js");

module.exports = class OldwarnsCommand extends BaseCommand {
	constructor() {
		super('seeoldwarns', 'moderation', [], 5, true, "See the old warnings of an user", "<userId/user>", new PermissionGuard(["MANAGE_MESSAGES"]));
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array} args 
	 */
	async run(client, msg, args) {
		let target = await msg.guild.members.fetch(msg.mentions.users.first() || args[0]);		var embedColor = '#ffffff';
		var missingArgsEmbed = new MessageEmbed()
				.setColor(embedColor)
				.setAuthor(msg.author.username, msg.author.avatarURL())
				.setTitle("Missing arguments")
				.setDescription(`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``)
				.setTimestamp();
		if (!target) return msg.channel.send(missingArgsEmbed);
		let user = await WarnModel.findOne({ userId : target.id, guildId: msg.guild.id });
		let oldUser = await OldWarnModel.findOne({ userId : target.id, guildId: msg.guild.id });
		if (!user) {
				msg.channel.send(`There is any warn for ${target.user.tag}`);
				return;
		}
		Seewarn(user, oldUser, msg, target, "Actual", "Old")
	}
}