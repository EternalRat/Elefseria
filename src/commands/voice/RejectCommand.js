const { Message, Client } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RejectCommand extends BaseCommand {
  constructor() {
    super('reject', 'vocal', [], 3, true, "Enlever la permission à un utilisateur de rejoindre le salon.", "<user/userId>", null);
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array} args 
   */
  async run(client, message, args) {
    if (args.length !== 1) return message.channel.send(`Usage: ${this.usage}`)
    const target = (await message.guild.members.fetch(message.mentions.users.first())) || message.guild.members.cache.find(m => m.id === args[0]);
    if (!message.member.voice.channel) return message.channel.send("Tu n'es pas dans un salon !");
    if (client.voiceChannel.has(message.member.voice.channel.id)) {
      if (client.voiceChannel.get(message.member.voice.channel.id) === message.author.id) {
        message.member.voice.channel.permissionOverwrites.edit(target.user.id, {
          "CONNECT": false
        })
        if (target.voice.channel && target.voice.channel.id === message.member.voice.channel.id) target.voice.setChannel(null);
      } else {
        message.channel.send("Tu n'es pas l'owner de ce salon !")
      }
    } else if (client.duoVoiceChannel.has(message.member.voice.channel.id)) {
      if (client.duoVoiceChannel.get(message.member.voice.channel.id) === message.author.id) {
        message.member.voice.channel.permissionOverwrites.edit(target.user.id, {
          CONNECT: false
        })
        if (target.voice.channel && target.voice.channel.id === message.member.voice.channel.id) target.voice.setChannel(null);
      } else {
        message.channel.send("Tu n'es pas l'owner de ce salon !")
      }
    } else if (client.betaVoiceChannel.has(message.member.voice.channel.id)) {
      if (client.betaVoiceChannel.get(message.member.voice.channel.id) === message.author.id) {
        message.member.voice.channel.permissionOverwrites.edit(target.user.id, {
          CONNECT: false
        })
        if (target.voice.channel && target.voice.channel.id === message.member.voice.channel.id) target.voice.setChannel(null);
      } else {
        message.channel.send("Tu n'es pas l'owner de ce salon !")
      }
    }
  }
}