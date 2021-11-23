require('dotenv').config();
const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require("../../utils/PermissionGuard")
const {MessageEmbed, Client, Message} = require("discord.js")
const {parseZone} = require("moment")

module.exports = class BanCommand extends BaseCommand {
	constructor() {
		super('ban', 'moderation', [], 5, true, "Ban a Discord user by his ID.", "<userId/user> <Reason>", new PermissionGuard(["BAN_MEMBERS", "KICK_MEMBERS"]));
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
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.setTitle("Missing arguments")
			.setDescription(`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``)
			.setTimestamp();
		let pattern = /[0-9]{18}/
		if (msg.mentions.users.first() || msg.guild.members.cache.find(m => m.id === args[0])) {
			let bUser = (await msg.guild.members.fetch(msg.mentions.users.first())) || msg.guild.members.cache.find(m => m.id === args[0])
			if (msg.guild.members.cache.get(msg.author.id).roles.highest.position <= bUser.roles.highest.position) return msg.channel.send("That person can't be banned!");
			let bReason = args.slice(1).join(" ");
			if (!bReason) return msg.channel.send({embeds: [missingArgsEmbed]})

			const ban = new MessageEmbed()
				.setTitle("You've been banned !")
				.setAuthor(msg.author.username, msg.author.avatarURL())
				.setDescription(`Reason :\n\`\`\`${bReason}\`\`\``)
			await bUser.send({embeds: [ban]})
			const banEmbed = new MessageEmbed()
				.setDescription("☆━━━━━━☆ Ban ☆━━━━━━☆")
				.setColor("#ff0000")
				.addField("Banned user:", `${bUser} - ${bUser.id}`)
				.addField("Banned by:", `<@${msg.author.id}> - ${msg.author.id}`)
				.addField("Banned in:", `${msg.channel}`)
				.addField("Time:", parseZone(msg.createdAt).format("dddd Do MMMM in YYYY, HH:mm:ss"))
				.addField("Reason:", bReason);
			bUser.ban({days: 7, reason: bReason});
			msg.channel.send({embeds: [banEmbed]})
		} else if (pattern.test(args[0])) {
			let bUser = args[0]
			let bReason = args.slice(1).join(" ");
			if (!bReason) return msg.channel.send({embeds: [missingArgsEmbed]})
			const banEmbed = new MessageEmbed()
				.setDescription("☆━━━━━━☆ Ban ☆━━━━━━☆")
				.setColor("#ff0000")
				.addField("Banned user:", `${bUser}`)
				.addField("Banned by:", `<@${msg.author.id}> - ${msg.author.id}`)
				.addField("Banned in:", `${msg.channel}`)
				.addField("Time:", parseZone(msg.createdAt).format("dddd Do MMMM in YYYY, HH:mm:ss"))
				.addField("Reason:", bReason);
			msg.guild.members.ban(bUser, {days: 7, reason: bReason});
			msg.channel.send({embeds: [banEmbed]})
		} else
			return msg.channel.send(missingArgsEmbed)
		msg.delete().catch();
	}
}