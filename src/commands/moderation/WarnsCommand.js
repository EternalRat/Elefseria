const { Seewarn } = require('../../utils/seewarn');
require('dotenv').config();
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const WarnModel = require("../../utils/database/models/warn")
const { MessageEmbed, Message, Client } = require("discord.js")

module.exports = class WarnsCommand extends BaseCommand {
	constructor() {
		super('warns', 'moderation', [], 5, true, "See the warnings of an user", "<userId/user>", new PermissionGuard(["MANAGE_MESSAGES"]));
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array} args 
	 */
	async run(client, msg, args) {
		try {
			var target = await msg.guild.members.fetch(msg.mentions.users.first() || args[0]);
		} catch (err) {}
		var embedColor = '#ffffff';
		var embedColor = '#ffffff';
		var missingArgsEmbed = new MessageEmbed()
				.setColor(embedColor)
				.setAuthor({
					name: msg.author.username, 
					iconURL: msg.author.avatarURL()
				})
				.setTitle("Missing arguments")
				.setDescription(`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``)
				.setTimestamp();
		if (!target) return msg.channel.send({embeds: [missingArgsEmbed]});
		let user = await WarnModel.findOne({ userId : target.id, guildId: msg.guild.id });
		if (!user) {
			msg.channel.send(`There is any warn for ${target.user.tag}`);
			return;
		}
		Seewarn(user, msg, target)
	}
}