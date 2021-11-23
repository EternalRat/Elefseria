const { Message, Client } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RejectCommand extends BaseCommand {
  constructor() {
    super('claim', 'vocal', [], 3, true, "Récupérer le titre d'owner du salon.", null, null);
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array} args 
   */
  run(client, message, args) {
    if (!message.member.voice.channel) return;
    if (client.voiceChannel.has(message.member.voice.channel.id)) {
      if (!message.member.voice.channel.members.has(client.voiceChannel.get(message.member.voice.channel.id))) {
        client.voiceChannel.delete(message.member.voice.channel.id)
        client.voiceChannel.set(message.member.voice.channel.id, message.author.id);
        message.member.voice.channel.setName(`${message.author.username}`)
        message.channel.send("Tu es maintenant l'owner du salon vocal !")
      } else {
        message.channel.send("L'owner du salon est déjà présent, tu ne peux claim ce salon !")
      }
    } else if (client.duoVoiceChannel.has(message.member.voice.channel.id)) {
      if (!message.member.voice.channel.members.has(client.duoVoiceChannel.get(message.member.voice.channel.id))) {
        client.duoVoiceChannel.delete(message.member.voice.channel.id)
        client.duoVoiceChannel.set(message.member.voice.channel.id, message.author.id);
        message.member.voice.channel.setName(`${message.author.username}`)
        message.channel.send("Tu es maintenant l'owner du salon vocal !")
      } else {
        message.channel.send("L'owner du salon est déjà présent, tu ne peux claim ce salon !")
      }
    } else if (client.betaVoiceChannel.has(message.member.voice.channel.id)) {
      if (!message.member.voice.channel.members.has(client.betaVoiceChannel.get(message.member.voice.channel.id))) {
        client.betaVoiceChannel.delete(message.member.voice.channel.id)
        client.betaVoiceChannel.set(message.member.voice.channel.id, message.author.id);
        message.member.voice.channel.setName(`[Beta] ${message.author.username}`)
        message.channel.send("Tu es maintenant l'owner du salon vocal !")
      } else {
        message.channel.send("L'owner du salon est déjà présent, tu ne peux claim ce salon !")
      }
    }
  }
}