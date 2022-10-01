const { Client, MessageReaction, GuildMember, MessageEmbed } = require('discord.js');
const MessageModel = require('../utils/database/models/reactionrole');
const ticketChannel = require("../utils/database/models/ticket");
const TranscriptTicket = require('../utils/transcriptTicket');
const GUserBlacklist = require("../utils/database/models/giveawayblacklist");
const Giveaway = require("../utils/database/models/giveaway");

module.exports = class Reaction {

	/**
	 * 
	 * @param {Client} client 
	 * @param {MessageReaction} reaction 
	 * @param {GuildMember} user 
	 */
	constructor(client, reaction, user) {
		this.client = client;
		this.reaction = reaction;
		this.user = user;
	}

	async addRole() {
		if (this.reaction.message.partial) {
            await this.reaction.message.fetch();
            let { id } = this.reaction.message;
            try {
                let msgDocument = await MessageModel.findOne({ messageId: id });
                if (msgDocument) {
                    this.client.cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
                    this._addMemberRole(this.client.cachedMessageReactions.get(this.reaction.message.id));
					return 1;
				}
            } catch(err) {
                console.log(err);
            }
        } else {
            if (this.client.cachedMessageReactions.get(this.reaction.message.id)) {
                this._addMemberRole(this.client.cachedMessageReactions.get(this.reaction.message.id));
				return 1;
			}
        }
		return 0;
	}

	async _addMemberRole(emojiRoleMappings) {
		if(emojiRoleMappings[this.reaction.emoji.id]) {
			let roleId = emojiRoleMappings[this.reaction.emoji.id];
			let role = await this.reaction.message.guild.roles.fetch(roleId);
			let member = this.reaction.message.guild.members.cache.get(this.user.id);
			if (role && member) {
				member.roles.add(role);
			}
		}
	}

	async checkBlacklist() {
		const giveaway = await Giveaway.findOne({guildId: this.reaction.message.guild.id, messageId: this.reaction.message.id});
		if (!giveaway) return;
		const blacklist = await GUserBlacklist.findOne({guildId: this.reaction.message.guild.id});
		if (!blacklist) {
			this.user.send(`Your participation for ${giveaway.get('prize')} has been confirmed.`);
			return 0;
		}
		const blacklistedUser = blacklist.get("users");
		if (blacklistedUser.length === 0) {
			this.user.send(`Your participation for ${giveaway.get('prize')} has been confirmed.`);
			return 0;
		}
		const userFound = blacklistedUser.find(user => user.id === this.user.id);
		if (!userFound) {
			this.user.send(`Your participation for ${giveaway.get('prize')} has been confirmed.`);
			return 0;
		}
		this.reaction.users.remove(this.user.id);
		this.user.send(`You cannot participate in the giveaway ${giveaway.get('prize')} because of : ${userFound.reason}`);
		return 1;
	}

	async createTicket() {
		const ticketCh = await ticketChannel.findOne({messageId: this.reaction.message.id});
		if (ticketCh && this.reaction.emoji.name === "📩") {
			this.reaction.users.remove(this.user.id);
			const channelParent = this.reaction.message.channel.parent;
			this.reaction.message.guild.nam
			this.reaction.message.guild.channels.create(`${ticketCh.get("ticketType")} ticket ${this.user.username}`, {
				type: "GUILD_TEXT",
				parent: channelParent
			}).then(async(ch) => {
				ch.permissionOverwrites.edit(this.user.id, {
					VIEW_CHANNEL: true
				})
				ch.permissionOverwrites.edit(this.reaction.message.guild.id, {
					VIEW_CHANNEL: false
				})
				setTimeout(() => {
					const ticketEmbed = new MessageEmbed()
						.setTitle(`Ticket`)
						.setDescription("Afin de fermer le ticket, il vous suffira d'appuyer sur la réaction 🔐.")
						.setAuthor({
							name: this.user.username, 
							iconURL: this.user.displayAvatarURL()
						})
						.setThumbnail(this.reaction.message.guild.iconURL())
						.setTimestamp();
					ch.send({content: `@everyone`, embeds: [ticketEmbed]}).then(msg => {
						msg.react("🔐");
						const filter = (reaction, userReact) => ["🔐"].includes(reaction.emoji.name) && userReact.id === this.user.id
						msg.awaitReactions({filter, max: 1}).then(async (collected) => {
							const reaction = collected.first();

							switch (reaction.emoji.name) {
								case "🔐":
									var user = this.user;
									var timer = 6;
									var timeToDel = setInterval(async() => {
										ticketEmbed.setDescription(`Le ticket se fermera dans ${--timer}secondes !`)
										if (timer <= 0) {
											clearing();
										} else {
											msg.edit({embeds: [ticketEmbed]});
										}
									}, 1000);
									async function clearing() {
										clearInterval(timeToDel);
										ch.permissionOverwrites.edit(user.id, {
											VIEW_CHANNEL: false
										});
										let newTranscript = new TranscriptTicket(ch.guild, ch.name, "EternalRat", user.username, ticketCh.get("ticketType"));
										newTranscript.doTranscript(ch.messages);
										newTranscript.createFile();
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