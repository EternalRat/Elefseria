const { Client, VoiceState } = require('discord.js');
const channel = require('../utils/database/models/channels');

module.exports = class Voice {
	/**
	 * 
	 * @param {Client} client 
	 * @param {VoiceState} oldState 
	 * @param {VoiceState} newState 
	 */
	constructor(client, oldState, newState) {
		this.client = client;
		this.oldState = oldState;
		this.newState = newState;
	}

	async voiceManager() {
		let channelAudio = await channel.findOne({guildId: this.newState.guild.id});
		if (!channelAudio) return;
		if (this.newState.channel) {
			this._createVoiceChannel(channelAudio);
		}
		if (oldState.channel) {
			this._deleteChannel();
		}
		this.logs(channelAudio);
	}

	async _createVoiceChannel(channelAudio) {
		if (this.newState.channel.id === channelAudio.get("normalVoice")) {
			let memberName = this.newState.member.user.username;
			this.newState.guild.channels.create(`${memberName}`, {
				type: "GUILD_VOICE",
				parent: this.newState.channel.parent
			}).then(channel => {
				this.client.voiceChannel.set(channel.id, this.newState.member.user.id)
				this.newState.setChannel(channel);
			})
		} else if (this.newState.channel.id === channelAudio.get("premiumVoice")) {
			if (!this.newState.member.roles.cache.find(r => r.id === "780779857276567563" || r.permissions.has("MANAGE_CHANNELS"))) return this.newState.setChannel(null);
			let memberName = this.newState.member.user.username;
			this.newState.guild.channels.create(`${memberName}`, {
				type: "GUILD_VOICE",
				parent: this.newState.channel.parent
			}).then(channel => {
				channel.permissionOverwrites.edit(this.oldState.member.user.id, {
					MUTE_MEMBERS: true,
					VIEW_CHANNEL: true,
					CONNECT: true,
					MOVE_MEMBERS: true
				});
				channel.permissionOverwrites.edit(this.client.user.id, {
					MANAGE_CHANNELS: true,
					VIEW_CHANNEL: true,
					CONNECT: true,
					MOVE_MEMBERS: true
				});
				this.newState.guild.channels.create(`Waiting room for ${memberName}`, {
					type: "voice",
					parent: this.newState.channel.parent
				}).then(ch => {
					ch.permissionOverwrites.edit(this.oldState.member.user.id, {
						MOVE_MEMBERS: true
					});
					ch.permissionOverwrites.edit(this.client.user.id, {
						MANAGE_CHANNELS: true,
						CONNECT: true,
						MOVE_MEMBERS: true
					});
					this.client.premiumChannel.set(channel.id, {userId: this.oldState.member.user.id, waitRoom: ch.id});
				})
				this.newState.setChannel(channel);
			});
		}
	}

	async _deleteChannel() {
		if (this.client.voiceChannel.has(this.oldState.channel.id)) {
			if (this.oldState.channel.members.size === 0) {
				this.oldState.guild.channels.cache.get(this.oldState.channel.id).delete();
				this.client.voiceChannel.delete(this.oldState.channel.id)
			}
		} else {
			if (this.client.premiumChannel.has(this.oldState.channel.id) && this.client.premiumChannel.get(this.oldState.channel.id).userId === this.oldState.member.user.id) {
				if (!this.newState.channel || (this.newState.channel && this.newState.channel.id !== this.oldState.channel.id)) {
					if (this.oldState.guild.channels.cache.has(this.client.premiumChannel.get(this.oldState.channel.id).waitRoom))
						this.oldState.guild.channels.cache.get(this.client.premiumChannel.get(this.oldState.channel.id).waitRoom).delete();
					this.oldState.guild.channels.cache.get(this.oldState.channel.id).delete();
					this.client.premiumChannel.delete(this.oldState.channel.id)
				}
			}
		}
	}

	logs(channelAudio) {
		let logVoice = this.oldState.guild.channels.cache.find(ch => ch.id === channelAudio.get("voiceLog"))
		if (!logVoice) return;
		if (this.newState.channel) {
			if (this.newState.channel === this.oldState.channel) return;
			const voiceEmbed = new MessageEmbed()
				.setTitle(`Un utilisateur a rejoint le salon ${this.newState.channel.name}`)
				.setDescription(`Son pseudo : ${this.newState.member.user.username}\n\
				Son Discord : ${this.newState.member.user}\n\
				Son ID : ${this.newState.member.user.id}`)
				.setColor("BLUE")
				.setTimestamp()
				logVoice.send({embeds: [voiceEmbed]});
			return;
		}
		if (this.oldState.channel) {
			const voiceEmbed = new MessageEmbed()
				.setTitle(`Un utilisateur a quitté le salon ${this.oldState.channel.name}`)
				.setDescription(`Son pseudo : ${this.oldState.member.user.username}\n\
				Son Discord : ${this.oldState.member.user}\n\
				Son ID : ${this.oldState.member.user.id}`)
				.setColor("RED")
				.setTimestamp()
				logVoice.send({embeds: [voiceEmbed]})
		}
	}
}