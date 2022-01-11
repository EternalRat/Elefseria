const { Client, Message, MessageEmbed } = require('discord.js');
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const ticketChannel = require("../../utils/database/models/ticket")
const logger = require("consola").withTag("ManageTicketCommand.js");
logger.level = 5;

var prompts = [
  "Give the channel id where you want to assign a ticket creator.",
  "Which type of ticket this will be ? (For example : minecraft, web-site, discord, ...)"
]

module.exports = class ManageTicketCommand extends BaseCommand {
  constructor() {
    super('manageTicket', 'support', ["createTicket", ], 3, false, "Assign a ticket creator to a channel", null, new PermissionGuard(["ADMINISTRATOR"]));
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
      logger.success("Channel found")
      var newChannel = await ticketChannel.findOne({guildId: message.guild.id, channelId: response.channelId})
      if (!newChannel) {
        newChannel = new ticketChannel({
          ticketType: response.channelType,
          channelId: response.channelId,
          messageId: "null",
          guildId: message.guild.id
        })
      } else {
        newChannel.set("channelId", response.channelId);
        newChannel.set("ticketType", response.channelType);
      }
      let ticketEmbed = new MessageEmbed()
        .setTitle(`Ticket`)
        .setDescription("Afin de créer un ticket, il vous suffit d'appuyer sur la réaction 📩.")
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setThumbnail(message.guild.iconURL())
        .setTimestamp();
      message.guild.channels.cache.get(response.channelId).send({embeds: [ticketEmbed]}).then(msg => {
        newChannel.set("messageId", msg.id);
        msg.react("📩")
        newChannel.save();
      })
      message.channel.send("Le salon a bien été définit.")
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

  for (let i = 0; i < prompts.length; i++) {
      await message.channel.send(prompts[i]);
      const filter = (m) => m.author.id === message.author.id;
      const response = await message.channel.awaitMessages({ filter, max: 1, time: 30_000, errors: ['time'] });
      const { content } = response.first();
      if (i === 0)
        if (message.guild.channels.cache.has(content))
          responses.channelId = content;
        else {
          message.channel.send("Entrée invalide pour le salon")
          return null;
        }
      if (i === 1)
        responses.channelType = content;
  }
  return responses;
}