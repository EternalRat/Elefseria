const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../utils/database/models/config');
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class ConfigCommand extends BaseCommand {
  constructor() {
    super('config', 'security', [], 3, true, "Check or update your server config", "[key] [value]", new PermissionGuard(["ADMINISTRATOR"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array} args 
   */
  async run(client, message, args) {
    const secConfig = await config.findOne({guildId: message.guild.id})
    if (!secConfig) return message.channel.send("You must create the database first!");
    if (args.length == 0) {
      const embed = new MessageEmbed()
        .setTitle("**Configuration**")
        .addFields({
            name:`Raidmode :`,
            value:`${secConfig.get("raidmode")}`,
            inline: true
        }, {
            name:`Blacklist :`,
            value:`${secConfig.get("blacklist")}`,
            inline: true
        }, {
            name:`Time : (seconds)`,
            value:`${secConfig.get("time")}`,
            inline: true
        }, {
            name:`People :`,
            value:`${secConfig.get("people")}`,
            inline: true
        })
        .setAuthor(message.author.username, message.author.avatarURL())
        .setThumbnail(message.guild.iconURL())
      return message.channel.send(embed)
    }
    if (args.length != 2) return message.channel.send("Specify raidmode/blacklist/time/people and another args.")
    let param = args[0]
    if (param != "raidmode" && param != "people" && param != "blacklist" && param != "time") return message.channel.send("Specify raidmode/blacklist/time/people and another args.")
    let tochange = args[1]
    if (param === "time" || param === "people") tochange = parseInt(args[1])
    if ((param === "raidmode" || param === "blacklist") && (tochange != "true" && tochange != "false")) return message.channel.send("Raidmode/Blacklist/antispam/antilink/bannedword must be composed only by true/false argument.")
    if ((param === "time" || param === "people") && tochange === args[1]) return message.channel.send("Time/People must be composed only by integer argument.")
    secConfig.set(param, tochange)
    secConfig.save().catch(console.error)
    message.channel.send(`The setting ${param} has been successfully changed.`)
  }
}