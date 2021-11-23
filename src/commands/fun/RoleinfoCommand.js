const { Client, Message, MessageEmbed } = require('discord.js');
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RoleinfoCommand extends BaseCommand {
  constructor() {
    super('roleinfo', 'utils', [], 5, true, "Show informations about a role.", "<role/roleID>", new PermissionGuard(["MANAGE_ROLES"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array} args 
   */
  run(client, message, args) {
    let role = message.guild.roles.cache.find(r => r.id === message.mentions.roles.first().id) || message.guild.roles.cache.find(r => r.id === args[0]);

    if (role) {
      let embed = new MessageEmbed()
        .setTitle(`Informations about the role ${role.name}`)
        .addFields({
          name: "ID",
          value: role.id,
          inline: true
        }, {
          name: "Color",
          value: role.hexColor,
          inline: true
        }, {
          name: "Creation date",
          value: role.createdAt,
          inline: true
        }, {
          name: "Position",
          value: role.position,
          inline: true
        }, {
          name: "Member count",
          value: role.members.size,
          inline: true
        }, {
          name: "Mentionnable",
          value: role.mentionable ? "True" : "False",
          inline: true
        })
        .setColor("BLUE")
      message.channel.send(embed);
    }
  }
}