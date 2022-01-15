const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require('../../utils/PermissionGuard');
const { MessageEmbed, Message, Client, TextChannel } = require("discord.js");
const fs = require("fs");
const ms = require("ms")
require('dotenv').config();

module.exports = class MuteCommand extends BaseCommand {
  constructor() {
	super('mute', 'moderation', [], 5, true, "Mute an user", "<userId/user> [duration]", new PermissionGuard(["MANAGE_MESSAGES"]));
  }

	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} msg 
	 * @param {Array} args 
	 */
	async run(client, msg, args) {
		let target = await msg.guild.members.fetch(msg.mentions.users.first() || args[0]);
		var embedColor = '#ffffff'
		var missingArgsEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.setTitle("Missing arguments")
			.setDescription(`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``)
			.setTimestamp();
		if (!target) return msg.channel.send({embeds: [missingArgsEmbed]})
		msg.delete().catch()
		if (msg.guild.members.cache.get(msg.author.id).roles.highest.position <= target.roles.highest.position) return msg.channel.send("That person can't be kicked!");
		let role = msg.guild.roles.cache.find(r => r.name === "Muted");
		if (!role) {
			try {
				role = await msg.guild.roles.create({
					name: "Muted",
					color: "#000000",
					permissions: []
				});
				msg.guild.channels.fetch().then(channels => {
					channels.forEach(channel => {
						channel.permissionOverwrites.edit(role, {
							'SEND_MESSAGES': false,
							'ADD_REACTIONS': false,
							'SPEAK': false
						});
					})
				})
			} catch (e) {
				console.log(e.stack);
			}
		}
		if(target.roles.cache.has(role.id)) return msg.channel.send("This user is already muted")
		var time;
		time = !args[1] ? ms("0s") : ms(args[1])
		client.mutes[target.id] = {
			guild: msg.guild.id,
			time: Date.now() + time,
			infinite: time === 0 ? true : false
		}
		await target.roles.add(role);

		fs.writeFile("./src/utils/json/mute.json", JSON.stringify(client.mutes, null, 4), err => {
			if (err) throw err;
			msg.channel.send(`${target} has been muted by ${msg.author}`);
		})
	}
}