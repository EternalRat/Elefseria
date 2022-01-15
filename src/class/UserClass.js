const {MessageEmbed, Client, GuildMember} = require("discord.js");
const channels = require("../utils/database/models/channels");
const SecConfig = require("../utils/database/models/config");
const blackList = require("../utils/database/models/blacklist");

module.exports = class User {
	/**
	 * 
	 * @param {Client} client 
	 * @param {GuildMember} member 
	 */
	constructor(client, member) {
		this.client = client;
		this.member = member;
	}

	async sendJoinMsg() {
		let channelDb = await channels.findOne({guildId: this.member.guild.id});
		if (!channelDb)
			return;
		const addingMember = new MessageEmbed()
			.setTitle("Nouvel arrivant !")
			.setAuthor(this.member.user.username, this.member.user.avatarURL())
			.addField(`**Bienvenue à ${this.member.user.username}**`, "N'oublie pas d'aller lire le règlement.")
			.setThumbnail(this.member.guild.iconURL())
			.setTimestamp()
			.setFooter("Copyright - " + client.user.username, client.user.avatarURL())
		let channel = this.member.guild.channels.cache.get(channelDb.get("channelWelcId"))
		if (channel)
			channel.send(addingMember)
	}

	async incrementCounter() {
		let users = await UsersChannel.findOne({ guildId: this.member.guild.id })
		if (!users)
			return;
		let count = (await this.member.guild.members.fetch()).filter(member => !member.user.bot).size;
		this.member.guild.channels.cache.get(users.get("channelId")).setName(`👨 Users count : ${count} 👨`);
	}

	// TODO
	/**
	 * Will check if the server is in raidmode and if it needs to be activated
	 * @returns {Boolean} Either it's fine or not
	 */
	raidProtect() {
		return 0;
	}
}