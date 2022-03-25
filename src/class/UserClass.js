const {MessageEmbed, Client, GuildMember} = require("discord.js");
const channels = require("../utils/database/models/channels");
const SecConfig = require("../utils/database/models/config");
const blackList = require("../utils/database/models/blacklist");
const Statistiques = require("../utils/database/models/statistiques");
const guildInvites = require("../utils/database/models/guildInvites");
const warnmodel = require("../utils/database/models/warn");

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

	/**
	 * Send a msg to the channel configured as the "join" channel
	 * @returns 
	 */
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
			.setFooter("Copyright - " + this.client.user.username, this.client.user.avatarURL())
		let channel = this.member.guild.channels.cache.get(channelDb.get("channelWelcId"))
		if (channel)
			channel.send(addingMember)
	}

	/**
	 * Increase the counter and change the channel name
	 * @returns 
	 */
	async incrementCounter() {
		let channel = await channels.findOne({ guildId: this.member.guild.id });
		if (!channel) return;
		let channelType = this.member.user.bot ? "bot" : "user";
		if (!channel.get(`${channelType}CountChannel`))
			return;
		let count = (async (guild) => {
			if (channelType === "bot")
				return (await guild.members.fetch()).filter(member => member.user.bot).size;
			return (await guild.members.fetch()).filter(member => !member.user.bot).size;
		});
		let memberCount = (await this.member.guild.members.fetch()).size;
		this.member.guild.channels.cache.get(channel.get(`${channelType}CountChannel`)).setName(`👨 ${channelType.slice(0, 1).toUpperCase() + channelType.slice(1)} count : ${count(this.member.guild)} 👨`);
		if (channel.get(`memberCountChannel`))
			this.member.guild.channels.cache.get(channel.get(`memberCountChannel`)).setName(`👨 ${channelType.slice(0, 1).toUpperCase() + channelType.slice(1)} count : ${memberCount} 👨`);
	}

	/**
	 * Increase the invite counter for the inviter
	 */
	async incrementInvite() {
		let guildInvite = await guildInvites.findOne({
			guildId: this.member.guild.id
		});
		const changedInvites = await this.member.guild.invites.fetch();
		try {
			const used = changedInvites.find((inv) => {
				return guildInvite.get("invites").get(inv.code).uses < inv.uses;
			})
			if (used.temporary) {
				if (used.inviter.id === this.member.id) return;
				let inv = guildInvite.get("invites");
				inv.get(used.code).uses++;
				guildInvite.set("invites", inv);
				guildInvite.save();
				let userStat = await Statistiques.findOne({ userId: used.inviter.id, guildId: used.guild.id });
				if (userStat.get("invitedUser").has(this.member.id)) {
					userStat.set("fakeCount", userStat.get("fakeCount") + 1);
					return;
				}
				userStat.set("invitesCount", userStat.get("invitesCount") + 1);
				let invitedUser = userStat.get("invitedUser");
				invitedUser.set(this.member.id, true);
				userStat.set("invitedUser", invitedUser);
				userStat.save();
			} else if (this.member.guild.vanityURLCode === used.code) {
				//TODO
			} else {
				if (used.inviter.id === this.member.id) return;
				let inv = guildInvite.get("invites");
				inv.get(used.code).uses++;
				guildInvite.set("invites", inv);
				guildInvite.save();
				let userStat = await Statistiques.findOne({ userId: used.inviter.id, guildId: used.guild.id });
				if (userStat.get("invitedUser").has(this.member.id)) {
					userStat.set("fakeCount", userStat.get("fakeCount") + 1);
					return;
				}
				userStat.set("invitesCount", userStat.get("invitesCount") + 1);
				let invitedUser = userStat.get("invitedUser");
				Logger
				invitedUser.set(this.member.id, true);
				userStat.set("invitedUser", invitedUser);
				userStat.save();
			}
		} catch (err) {console.log(err)}
	}

	/**
	 * Send a msg to the channel configured as the "left" channel
	 */
	async sendLeftMsg() {
		const removeMember = new MessageEmbed()
			.setTitle("Départ !")
			.setAuthor(this.member.user.username, this.member.user.avatarURL())
			.setDescription(`**Au revoir à ${this.member.user.username}**`)
			.setThumbnail(this.member.guild.iconURL())
			.setTimestamp()
			.setFooter("Copyright - " + this.client.user.username, this.client.user.avatarURL())
		let channelDb = await channels.findOne({guildId: this.member.guild.id})
		if (channelDb) {
			let channel = this.member.guild.channels.cache.get(channelDb.get("channelLeft"))
			if (channel)
				channel.send(removeMember)
		}
	}

	/**
	 * Decrease the counter and modify the channel name
	 */
	async decrementCounter() {
		let channel = await channels.findOne({ guildId: this.member.guild.id });
		if (!channel) return;
		let channelType = this.member.user.bot ? "bot" : "user";
		if (channel.get(`${channelType}CountChannel`)) {
			let count = (async(guild) => {
				if (channelType === "bot")
					return (await guild.members.fetch()).filter(member => member.user.bot).size;
				return (await guild.members.fetch()).filter(member => !member.user.bot).size;
			});
			let memberCount = (await this.member.guild.members.fetch()).size;
			this.member.guild.channels.cache.get(channel.get(`${channelType}CountChannel`)).setName(`👨 ${channelType.slice(0, 1).toUpperCase() + channelType.slice(1)} count : ${count(this.member)} 👨`)
			if (channel.get(`memberCountChannel`))
				this.member.guild.channels.cache.get(channel.get(`memberCountChannel`)).setName(`👨 Member count : ${memberCount} 👨`);
		}
	}

	async decrementInvite() {
		let userStat = await (await Statistiques.find({ guildId: this.member.guild.id })).find((user => {
			return user.get('invitedUser').has(id => id === this.member.user.id)
		}));
		if (!userStat) return;
		let invitedUser = userStat.get("invitedUser");
		invitedUser.set(invitedUser.get(id => id === this.member.id), false);
		userStat.set("invitedUser", invitedUser);
		userStat.set("invitesCount", userStat.get("invitesCount") - 1);
		userStat.save();
	}

	async setWarnStatus(status) {
		let warn = await warnmodel.findOne({guildId: this.member.guild.id, userId: this.member.user.id});
		if (!warn)
			return;
		warn.set("active", status);
		warn.save();
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