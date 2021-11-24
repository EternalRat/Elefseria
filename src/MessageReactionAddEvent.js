// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionAdd
const { Client, MessageReaction, User, MessageEmbed } = require('discord.js');
const BaseEvent = require('./utils/structures/BaseEvent');
const ticketChannel = require("./utils/database/models/ticket");
const TranscriptTicket = require('./utils/transcriptTicket');

module.exports = class MessageReactionAddEvent extends BaseEvent {
	constructor() {
		super('messageReactionAdd');
	}
	
	/**
	 * 
	 * @param {Client} client 
	 * @param {MessageReaction} reaction 
	 * @param {User} user 
	 */
	async run(client, reaction, user) {
		if (user.id === client.user.id) return;
		const ticketCh = await ticketChannel.findOne({messageId: reaction.message.id});
		if (ticketCh && reaction.emoji.name === "📩") {
			reaction.users.remove(user.id);
			const channelParent = reaction.message.channel.parent;
			reaction.message.guild.nam
			reaction.message.guild.channels.create(`${ticketCh.get("ticketType")} ticket ${user.username}`, {
				type: "text",
				parent: channelParent
			}).then(async(ch) => {
				ch.updateOverwrite(user.id, {
					VIEW_CHANNEL: true
				})
				ch.updateOverwrite(reaction.message.guild.id, {
					VIEW_CHANNEL: false
				})
				setTimeout(() => {
					const ticketEmbed = new MessageEmbed()
						.setTitle(`Ticket`)
						.setDescription("Afin de fermer le ticket, il vous suffira d'appuyer sur la réaction 🔐.")
						.setAuthor(user.username, user.displayAvatarURL())
						.setThumbnail(reaction.message.guild.iconURL())
						.setTimestamp();
					ch.send(`@everyone`, ticketEmbed).then(msg => {
						msg.react("🔐");
						const filter = (reaction, userReact) => ["🔐"].includes(reaction.emoji.name) && userReact.id === user.id
						msg.awaitReactions(filter, {max: 1}).then(async (collected) => {
							const reaction = collected.first()

							switch (reaction.emoji.name) {
								case "🔐":
									var timer = 6;
									var timeToDel = setInterval(async() => {
										ticketEmbed.setDescription(`Le ticket se fermera dans ${--timer}secondes !`)
										if (timer <= 0) {
											clearing();
										} else {
											msg.edit(ticketEmbed);
										}
									}, 1000);
									async function clearing() {
										clearInterval(timeToDel);
										ch.updateOverwrite(user.id, {
											VIEW_CHANNEL: false
										});
										if (ch.guild.id === "872779126094827570") {
											ch.delete();
											return;
										}
										let newTranscript = new TranscriptTicket(ch.guild, ch.name, "EternalRat", user.username, ticketCh.get("ticketType"));
										newTranscript.doTranscript(ch.messages);
										newTranscript.createFile();
										ch.delete();
									}
									break;
							}
						})
					})
				}, 1000)
			})
		}
	}
}