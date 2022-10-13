const { Message } = require("discord.js");
const TranscriptTicket = require('../../utils/transcriptTicket');

module.exports = class Ticket {

	constructor(msg){
		this.msg = msg;
	}

	/**
	 * 
	 * @param {Message} msg 
	 */
	closeTicket() {
		this.msg.channel.permissionOverwrites.edit(this.msg.guild.id, {
			"VIEW_CHANNEL": false
		});
		console.log("Yes ?")
	}

	/**
	 * 
	 */
	transcriptTicket(seller) {
		let [type, nothing, ...customer] = this.msg.channel.name.replace(/-/g, " ").replace("ticket", " ").split(' ').filter(e => e !== '')
		let newTranscript = new TranscriptTicket(this.msg.channel.guild, this.msg.channel.name, seller, customer, type);

		newTranscript.doTranscript(this.msg.channel.messages).then(() => newTranscript.createFile());
	}

	/**
	 * 
	 * @param {Array<String>} args 
	 */
	async removePersonTicket(args) {
		let member = (await msg.guild.members.fetch(msg.mentions.users.first())) || msg.guild.members.cache.find(m => m.id === args[0])

		if (!member) return;
		this.msg.channel.permissionOverwrites.edit(member, {
			VIEW_CHANNEL: false
		})
	}
  
	/*
	 * @param {Message} msg 
	 * @param {Array<String>} args
	 */
	async addPersonTicket(args) {
		let member = (await this.msg.guild.members.fetch(this.msg.mentions.users.first())) || this.msg.guild.members.cache.find(m => m.id === args[0])

		if (!member) return;
		this.msg.channel.permissionOverwrites.edit(member, {
			VIEW_CHANNEL: true
		});
	}
}