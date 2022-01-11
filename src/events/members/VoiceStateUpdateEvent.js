// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const { Client, VoiceState } = require('discord.js');
const audiochannel = require('../../utils/database/models/audiochannel');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class WoiceStateUpdateEvent extends BaseEvent {
  constructor() {
    super('voiceStateUpdate');
  }
  
  /**
   * 
   * @param {Client} client 
   * @param {VoiceState} oldState 
   * @param {VoiceState} newState 
   */
  async run(client, oldState, newState) {
    if (newState.member.user.bot) return;
    let channelAudio = await audiochannel.findOne({guildId: newState.guild.id});
    if (!channelAudio) return;
    if (newState.channel) {
      if (newState.channel.id === channelAudio.get("normalChannelId")) {
        let memberName = newState.member.user.username;
        newState.guild.channels.create(`${memberName}`, {
          type: "GUILD_VOICE",
          parent: newState.channel.parent
        }).then(channel => {
          client.voiceChannel.set(channel.id, newState.member.user.id)
          newState.setChannel(channel);
        })
      } else if (newState.channel.id === channelAudio.get("premiumChannelId")) {
        if (!newState.member.roles.cache.find(r => r.id === "780779857276567563" || r.permissions.has("MANAGE_CHANNELS"))) return newState.setChannel(null);
        let memberName = newState.member.user.username;
        newState.guild.channels.create(`${memberName}`, {
          type: "GUILD_VOICE",
          parent: newState.channel.parent
        }).then(channel => {
          channel.permissionOverwrites.edit(oldState.member.user.id, {
            MUTE_MEMBERS: true,
            VIEW_CHANNEL: true,
            CONNECT: true,
            MOVE_MEMBERS: true
          });
          channel.permissionOverwrites.edit(client.user.id, {
            MANAGE_CHANNELS: true,
            VIEW_CHANNEL: true,
            CONNECT: true,
            MOVE_MEMBERS: true
          });
          newState.guild.channels.create(`Waiting room for ${memberName}`, {
            type: "voice",
            parent: newState.channel.parent
          }).then(ch => {
            ch.permissionOverwrites.edit(oldState.member.user.id, {
              MOVE_MEMBERS: true
            });
            ch.permissionOverwrites.edit(client.user.id, {
              MANAGE_CHANNELS: true,
              CONNECT: true,
              MOVE_MEMBERS: true
            });
            client.premiumChannel.set(channel.id, {userId: oldState.member.user.id, waitRoom: ch.id});
          })
          newState.setChannel(channel);
        })
      }
    }
    if (oldState.channel) {
      if (client.voiceChannel.has(oldState.channel.id)) {
        if (oldState.channel.members.size === 0) {
          oldState.guild.channels.cache.get(oldState.channel.id).delete();
          client.voiceChannel.delete(oldState.channel.id)
        }
      } else {
        if (client.premiumChannel.has(oldState.channel.id) && client.premiumChannel.get(oldState.channel.id).userId === oldState.member.user.id) {
          if (!newState.channel || (newState.channel && newState.channel.id !== oldState.channel.id)) {
            if (oldState.guild.channels.cache.has(client.premiumChannel.get(oldState.channel.id).waitRoom))
              oldState.guild.channels.cache.get(client.premiumChannel.get(oldState.channel.id).waitRoom).delete();
            oldState.guild.channels.cache.get(oldState.channel.id).delete();
            await client.premiumChannel.delete(oldState.channel.id)
          }
        }
      }
    }
  }
}