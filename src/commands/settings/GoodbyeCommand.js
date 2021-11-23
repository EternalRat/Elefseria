const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const channels = require("../../utils/database/models/channels");
const { Client, Message } = require('discord.js');

module.exports = class GiveawaychannelCommand extends BaseCommand {
  constructor() {
    super('goodbyechannel', 'channels', ["gc"], 3, true, "Configure the goodbye channel", "<channel>", new PermissionGuard(["MANAGE_CHANNELS"]));
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
      let channelGBId = msg.mentions.channels.first().id
      if (!channelGBId) return;
      if (!existing) {
        let newWc = new channels({
          channelWelcId: null,
          channelGBId,
          guildId
        })
        newWc.save().catch(err=>console.log(err))
        return msg.channel.send("The goodbye channel has been successfully configured")
      }
      await msg.channel.send("Do you want to change the channel ? Type yes or no");
      const response = await msg.channel.awaitMessages(m => m.author.id === msg.author.id,
        {max: 1, time: 30000, errors: ['time'] });
      if (response.first().content === "yes") {
        existing.set("channelGBId", channelGBId)
        existing.save().catch(err=>console.log(err))
        return msg.channel.send("The goodbye channel has been successfully configured")
      }
      msg.react('👍')
    }
}