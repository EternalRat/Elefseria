const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require('../../utils/PermissionGuard');
const {MessageEmbed, Client, Message} = require("discord.js");
const { parseZone } = require('moment');

module.exports = class UserinfoCommand extends BaseCommand {
  constructor() {
    super('userinfo', 'moderation', ["whois", "who", "ui", "user"], 3, true, "Show some information about an user", "<userId/user>", new PermissionGuard(["MANAGE_MESSAGES"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array} args 
   */
  async run(client, msg, args) {
		let target = await msg.guild.members.fetch(msg.mentions.users.first() || args[0]);		var embedColor = '#ffffff';
    let userInfo = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Information about an user")
        .setThumbnail(target.user.displayAvatarURL() + '?size=2048')
        .addField("Username:", `${target.user.tag}`, true)
        .addField("ID:", `${target.user.id}`, true)
        .addField("Account creation date:", parseZone(target.user.createdAt).format("dddd Do MMMM in YYYY, HH:mm:ss"))
        .addField("Joined the:", parseZone(target.joinedAt).format("dddd Do MMMM in YYYY, HH:mm:ss"))
        .addField("Status:", target.presence ? target.presence.activities[0].state : "Any custom status set")
        .addField("Roles:", target.roles.cache.map(r => r.name).join(', '), true)
        .addField("Bot?!", `${target.user.bot}`, true)
        .setFooter(`Copyright - ${client.user.username}`, client.user.displayAvatarURL() + '?size=2048')
    msg.channel.send({embeds: [userInfo]})

  }
}