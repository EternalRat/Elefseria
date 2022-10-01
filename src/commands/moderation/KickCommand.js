require('dotenv').config();
const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const PermissionGuard = require('../../utils/PermissionGuard');
const { parseZone } = require('moment');

module.exports = class KickCommand extends BaseCommand {
	constructor() {
		super('kick', 'moderation', [], 5, true, "Kick a Discord user by his ID.", "<userId/user> <Reason>",new PermissionGuard(["KICK_MEMBERS"]));
	}

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array} args 
	 */
	async run(client, msg, args) {
		var embedColor = '#ffffff'
		var missingArgsEmbed = new MessageEmbed() // Creates the embed thats sent if the command isnt run right
				.setColor(embedColor)
				.setAuthor({
					name: msg.author.username, 
					iconURL: msg.author.avatarURL()
				})
				.setTitle("Missing arguments")
				.setDescription(`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``)
				.setTimestamp();
		try {
			var kUser = await msg.guild.members.fetch(msg.mentions.users.first() || args[0]);
		} catch (err) {}
		if (!kUser) return msg.channel.send({embeds: [missingArgsEmbed]});
		if (msg.guild.members.cache.get(msg.author.id).roles.highest.position <= kUser.roles.highest.position) return msg.channel.send("You can't kick this member");
		msg.delete().catch();
		let kReason = args.slice(1).join(" ");
		if (!kReason) return msg.channel.send({embeds: [missingArgsEmbed]})

		const kick2 = new MessageEmbed()
			.setTitle("You've been kicked !")
			.setAuthor({
				name: msg.author.username, 
				iconURL: msg.author.avatarURL()
			})
			.setDescription(`Reason :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)
		kUser.send({embeds: [kick2]}).then(() => {
			const kickEmbed = new MessageEmbed()
				.setDescription("☆━━━━━━☆ Kick ☆━━━━━━☆")
				.setColor("#ff0000")
				.addField("Kicked user:", `${kUser} - ${kUser.id}`)
				.addField("Kicked by:", `<@${msg.author.id}> - ${msg.author.id}`)
				.addField("Kicked in:", `${msg.channel}`)
				.addField("Time:", parseZone(msg.createdAt).format("dddd Do MMMM in YYYY, HH:mm:ss"))
				.addField("Reason:", kReason);
			kUser.kick(kReason);
			msg.channel.send({embeds: [kickEmbed]})
		})
	}
}