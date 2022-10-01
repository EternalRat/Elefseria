const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed, Client, Message, MessageActionRow, MessageButton, TextChannel } = require("discord.js");
const PermissionGuard = require('../../utils/PermissionGuard');
const XP = require("../../utils/database/models/exp");

module.exports = class Drop extends BaseCommand {
	constructor() {
		super('dropxp', 'leveling', ["drop", "drop-xp", "xpdrop"], 3, true, "Drop a message which we'll give some xp to the first who react to it.", "<amount> <channelId>", new PermissionGuard(["MANAGE_CHANNELS"]));
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
			.setDescription(`\`${client.prefix}dropxp <amount> <channelId>\``)
			.setFields([
				{
					name: "amount",
					value: "The amount of xp you'll give."
				}, {
					name: "channelId",
					value: "The channel where the message will be send."
				}
			]);
		if (!args.length) return msg.channel.send(missingArgs);
		var amount = parseInt(args[0]);
		var channel = await msg.guild.channels.fetch(msg.mentions.channels.first().id || args[1]);
		const drop = new MessageEmbed()
			.setTitle("XP DROP")
			.setDescription(`${amount}xp will be given to the first one who react !`);
		const btnRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("drop")
				.setLabel("Get XP")
				.setStyle("PRIMARY")
		);
		channel.send({embeds: [drop], components: [btnRow]}).then(msg => {
			const filter = (interaction) => interaction.customId === "drop";
			const collector = msg.createMessageComponentCollector({filter, max: 1, maxUsers: 1, time: 60_000});
			collector.on('collect', i => {
				i.reply({
					content: `You won ${amount}xp congratulations !`,
					ephemeral: true
				});
			});
			collector.on('end', async (collection) => {
				const {member} = collection.first();
				var userExp = await XP.findOne({
					userId: member.id,
					guildId: member.guild.id
				});
				if (!userExp) {
					userExp = await XP.create({
						userId: member.id,
						guildId: member.guild.id,
						exp: 0,
						level: 0,
						lastDateMessage: new Date()
					});
				}
				userExp.set("exp", userExp.get("exp") + amount);
				const curLevel = Math.floor(0.1 * Math.sqrt(userExp.get("exp")));
				if (userExp.get("level") < curLevel) {
					userExp.set("level", curLevel);
					member.send({
						content: `Your level has been increased thanks to the event. You're now level ${curLevel}.`
					});
				}
				userExp.save();
				const drop = new MessageEmbed()
					.setTitle("XP DROP FINISHED")
					.setDescription(`Congrats to ${member.user.username} who won the prize !`);
				await msg.edit({
					embeds: [drop],
					components: []
				})
			})
		});
	}
}