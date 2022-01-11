const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require('../../utils/PermissionGuard');
const { Client, Message } = require('discord.js');
const audiochannel = require('../../utils/database/models/audiochannel');
const logger = require("consola").withTag("RepCommand.js")
logger.level = 5;

const questions = [
  "Quel est le type du salon que vous voulez ajouter ? (Normal/Premium)",
  "Quel est l'ID du salon qui servira pour la création des vocaux ? (Salon vocal obligatoirement !)"
]

module.exports = class AudiochannelCommand extends BaseCommand {
  constructor() {
    super('audiochannel', 'vocal', ["setchannel"], 3, false, "Définir le salon qui servira à créer les autres salons.", null, new PermissionGuard(["ADMINISTRATOR"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array} args 
   */
  async run(client, message, args) {
    try {
      const response = await getResponses(message)
      if (message.guild.channels.cache.find(ch => ch.id === response.channelId)) {
        logger.success("Channel found")
        var newAudio = await audiochannel.findOne({guildId: message.guild.id})
        if (!newAudio) {
          newAudio = new audiochannel({
            normalChannelId: "empty",
            premiumChannelId: "empty",
            guildId: message.guild.id
          })
        }
        newAudio.set(`${response.type}ChannelId`, response.channelId);
        newAudio.save();
        message.channel.send("Le salon a bien été définit.")
      }
    } catch(err) {
      console.log(err)
    }
  }
}

/**
 * 
 * @param {Message} message 
 */
async function getResponses(message) {
  const responses = { };
  const validType = ["normal", "beta", "duo", "premium"]
  const validId = /[0-9]{18}/;

  for (let i = 0; i < questions.length; i++) {
      await message.channel.send(questions[i]);
      const filter = (m) => m.author.id === message.author.id;
      const response = await message.channel.awaitMessages({ filter, max: 1, time: 30_000, errors: ['time'] });
      const { content } = response.first();
      if (i === 0)
        if (validType.includes(content.toLowerCase()))
          responses.type = content.toLowerCase();
        else {
          message.channel.send("Entrée invalide pour le type de salon")
          return null;
        }
      if (i === 1)
        if (validId.test(content))
          responses.channelId = content;
        else {
          message.channel.send("Entrée invalide pour l'ID du salon")
          return null;
        }
  }
  return responses;
}