// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const { Client, VoiceState, MessageEmbed } = require('discord.js');
const BaseEvent = require('../utils/structures/BaseEvent');
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
    let channelAudio = oldState.guild.channels.cache.find(ch => ch.name === "voice-logs")
    if (!channelAudio) return;
    if (newState.channel) {
      if (newState.channel === oldState.channel) return;
      const voiceEmbed = new MessageEmbed()
        .setTitle(`Un utilisateur a rejoint le salon ${newState.channel.name}`)
        .setDescription(`Son pseudo : ${newState.member.user.username}\n\
        Son Discord : ${newState.member.user}\n\
        Son ID : ${newState.member.user.id}`)
        .setColor("BLUE")
        .setTimestamp()
      channelAudio.send(voiceEmbed)
      return;
    }
    if (oldState.channel) {
      const voiceEmbed = new MessageEmbed()
      .setTitle(`Un utilisateur a quitté le salon ${oldState.channel.name}`)
      .setDescription(`Son pseudo : ${oldState.member.user.username}\n\
      Son Discord : ${oldState.member.user}\n\
      Son ID : ${oldState.member.user.id}`)
        .setColor("RED")
        .setTimestamp()
      channelAudio.send(voiceEmbed)
    }
  }
}