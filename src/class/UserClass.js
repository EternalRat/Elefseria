const {MessageEmbed, Client, GuildMember} = require("discord.js");
const channels = require("../utils/database/models/channels");
const SecConfig = require("../utils/database/models/config");
const blackList = require("../utils/database/models/blacklist");
const Statistiques = require("../utils/database/models/statistiques");
const guildInvites = require("../utils/database/models/guildInvites");
const warnmodel = require("../utils/database/models/warn");
const Logger = require("./Logger");
const { parseZone } = require("moment");

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
		var text = channelDb.get('joinMsg');
		if (!text)
			return;
		text = this._replaceText(text);
		if (channelDb.get('joinMsgDM')) {
			this.member.send({content: text});
			return;
		}
		const addingMember = new MessageEmbed()
			.setTitle("Nouvel arrivant !")
			.setAuthor({
				name: this.member.user.username, 
				iconURL: this.member.user.avatarURL()
			})
			.setDescription(text)
			.setThumbnail(this.member.guild.iconURL())
			.setTimestamp()
			.setFooter({
				text: "Copyright - " + this.client.user.username, 
				iconURL: this.client.user.avatarURL()
			})
		let channel = this.member.guild.channels.cache.get(channelDb.get("channelJoin"))
		if (channel)
			channel.send({embeds: [addingMember]});
	}

	/**
	 * 
	 * @param {String} text 
	 */
	_replaceText(text) {
		const objects = [{
			search: '{memberMention}',
			replace: `<@${this.member.user.id}>`
		}, {
			search: '{memberName}',
			replace: this.member.user.username
		}, {
			search: '{memberCreatedSince}',
			replace: (() => {
				const today = new Date();
				const date = new Date(this.member.user.createdTimestamp);
				const y = today.getFullYear() - date.getFullYear();
				const m = today.getMonth() - date.getMonth();
				const d = today.getDate() - date.getDate();
				const h = today.getHours() - date.getHours();
				const min = today.getMinutes() - date.getMinutes();
				const s = today.getSeconds() - date.getSeconds();
				return `${y}year(s) ${m}month(s) ${d}day(s) ${h}hours(s) ${min}minutes ${s}seconds ago`;
			})
		}, {
			search: '{memberCreatedDate}',
			replace: parseZone(this.member.user.createdTimestamp).format("dddd Do MMMM in YYYY, HH:mm:ss")
		}, {
			search: '{guildMemberCount}',
			replace: this.member.guild.memberCount
		}, {
			search: '{guildName}',
			replace: this.member.guild.name
		}];
		objects.forEach((obj) => {
			while (text.indexOf(obj.search) !== -1)
				text = text.replace(obj.search, obj.replace);
		});
		return text;
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
		let memberCount = (await this.member.guild.members.fetch()).size;
		this.member.guild.channels.cache.get(channel.get(`${channelType}CountChannel`)).setName(`${channelType.slice(0, 1).toUpperCase() + channelType.slice(1)} count : ${await this._count(channelType)}`);
		if (channel.get(`memberCountChannel`))
			this.member.guild.channels.cache.get(channel.get(`memberCountChannel`)).setName(`${channelType.slice(0, 1).toUpperCase() + channelType.slice(1)} count : ${memberCount}`);
	}

	async _count(channelType) {
		if (channelType === "bot")
			return (await this.member.guild.members.fetch()).filter(member => member.user.bot).size;
		return (await this.member.guild.members.fetch()).filter(member => !member.user.bot).size;
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
				this._onNormalInvites(guildInvite, used);
			} else if (this.member.guild.vanityURLCode === used.code) {
				//TODO
			} else {
				this._onNormalInvites(guildInvite, used);
			}
		} catch (err) {console.log(err)}
	}

	async _onNormalInvites(guildInvite, used) {
		if (used.inviter.id === this.member.id) return;
		let inv = guildInvite.get("invites");
		inv.get(used.code).uses++;
		guildInvite.set("invites", inv);
		guildInvite.save();
		let userStat = await Statistiques.findOne({ userId: used.inviter.id, guildId: used.guild.id });
		if (!userStat) return;
		let findUser = userStat.get('invitedUser').has(this.member.user.id);
		if (findUser) {
			return;
		}
		let newAcc = this._isANewAccount();
		if (newAcc)
			userStat.set("fakeCount", userStat.get("fakeCount") + 1);
		else
			userStat.set("joinedCount", userStat.get("joinedCount") + 1);
		let invitedUser = userStat.get("invitedUser");
		invitedUser.set(this.member.id, true);
		userStat.set("invitedUser", invitedUser);
		userStat.save();
	}

	/**
	 * 
	 * @returns {Boolean}
	 */
	_isANewAccount() {
		let accDate = this.member.user.createdTimestamp;
		let lastWeek = new Date();
		let timestamp = lastWeek.setDate(new Date().getDate() - 7);
		if (accDate > timestamp)
			return true;
		return false;
	}

	/**
	 * Send a msg to the channel configured as the "left" channel
	 */
	async sendLeftMsg() {
		let channelDb = await channels.findOne({guildId: this.member.guild.id});
		if (!channelDb) return;
		var text = channelDb.get('leftMsg');
		if (!text)
			return;
		text = this._replaceText(text);
		const removeMember = new MessageEmbed()
			.setTitle("Départ !")
			.setAuthor({
				name: this.member.user.username, 
				iconURL: this.member.user.avatarURL()
			})
			.setDescription(text)
			.setThumbnail(this.member.guild.iconURL())
			.setTimestamp()
			.setFooter({
				"text": "Copyright - " + this.client.user.username, 
				"iconURL": this.client.user.avatarURL()
			})
		let channel = this.member.guild.channels.cache.get(channelDb.get("channelLeft"));
		if (channel)
			channel.send({embeds: [removeMember]});
	}

	/**
	 * Decrease the counter and modify the channel name
	 */
	async decrementCounter() {
		let channel = await channels.findOne({ guildId: this.member.guild.id });
		if (!channel) return;
		let channelType = this.member.user.bot ? "bot" : "user";
		if (channel.get(`${channelType}CountChannel`)) {
			let memberCount = (await this.member.guild.members.fetch()).size;
			this.member.guild.channels.cache.get(channel.get(`${channelType}CountChannel`)).setName(`${channelType.slice(0, 1).toUpperCase() + channelType.slice(1)} count : ${await this._count(channelType)}`)
			if (channel.get(`memberCountChannel`))
				this.member.guild.channels.cache.get(channel.get(`memberCountChannel`)).setName(`Member count : ${memberCount}`);
		}
	}

	async decrementInvite() {
		let userStat = await (await Statistiques.find({ guildId: this.member.guild.id })).find((user => {
			return user.get('invitedUser').get(this.member.user.id);
		}));
		if (!userStat) return;
		let invitedUser = userStat.get("invitedUser");
		invitedUser.set(this.member.id, false);
		userStat.set("invitedUser", invitedUser);
		userStat.set("leftCount", userStat.get("leftCount") + 1);
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