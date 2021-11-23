const { Client, Message } = require('discord.js');
const config = require('../../utils/database/models/config');
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class SetupCommand extends BaseCommand {
  constructor() {
    super('setup', 'security', [], 3, true, "Create the db for your server", null, new PermissionGuard(["ADMINISTRATOR"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array} args 
   */
  async run(client, message, args) {
    const guildConfig = await config.findOne({guildId: message.guild.id})
    if (guildConfig) return message.channel.send("DB has already been created before")
    const newConfig = new config({
      raidmode: false,
      blacklist: false,
      time: 3,
      people: 5,
      guildId: message.guild.id
    })
    newConfig.save().then(message.channel.send("DB configured")).catch(console.error)
  }
}