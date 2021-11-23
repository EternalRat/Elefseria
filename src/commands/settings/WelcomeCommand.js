const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const channels = require("../../utils/database/model/channels");
const { Client, Message } = require('discord.js');

module.exports = class WelcomeCommand extends BaseCommand {
  constructor() {
    super('welcome', 'channels', ["wc"], 3, true, "Configure the welcome channel", "<channel>", new PermissionGuard(["MANAGE_CHANNELS"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array} args 
   */
  async run(client, msg, args) {
    let existing = await channels.findOne({guildId: msg.guild.id})
    let guildId = msg.guild.id
    let channelWelcId = msg.mentions.channels.first().id
    if (!channelWelcId) return;
    if (!existing) {
      let newWc = new channels({
        channelWelcId,
        channelGBId: null,
        guildId
      })
      newWc.save().catch(err=>console.log(err))
      return msg.channel.send("The welcome channel has been successfully configured")
    }
    await msg.channel.send("Do you want to change the channel ? Type yes or no");
    const response = await msg.channel.awaitMessages(m => m.author.id === msg.author.id,
      {max: 1, time: 30000, errors: ['time'] });
    if (response.first().content === "yes") {
      existing.set("channelWelcId", channelWelcId)
      existing.save().catch(err=>console.log(err))
      return msg.channel.send("The welcome channel has been successfully configured")
    }
    msg.react('👍')
  }
}