const BaseEvent = require('../../utils/structures/BaseEvent');
const {MessageEmbed, GuildMember, Client} = require("discord.js")
const UsersChannel = require("../../utils/database/models/userscount");
const channels = require("../../utils/database/models/channels");
const warnmodel = require('../../utils/database/models/warn');

module.exports = class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove');
  }
  
  /**
   * 
   * @param {Client} client 
   * @param {GuildMember} member 
   */
  async run(client, member) {
    const removeMember = new MessageEmbed()
      .setTitle("Départ !")
      .setAuthor(member.user.username, member.user.avatarURL())
      .setDescription(`**Au revoir à ${member.user.username}**`)
      .setThumbnail(member.guild.iconURL())
      .setTimestamp()
      .setFooter("Copyright - " + client.user.username, client.user.avatarURL())
    let channelDb = await channels.findOne({guildId: member.guild.id})
    if (channelDb) {
      let channel = member.guild.channels.cache.get(channelDb.get("channelGBId"))
      if (channel)
        channel.send(removeMember)
    }
    let users = await UsersChannel.findOne({ guildId: member.guild.id })
    if (users) {
      let count = (await member.guild.members.fetch()).filter(member => !member.user.bot).size
      member.guild.channels.cache.get(users.get("channelId")).setName(`👨 Users count : ${count} 👨`)
    }
    let warned = await warnmodel.findOne({userId: member.user.id});
    if (warned) {
      warnmodel.remove(warned);
    }
  }
}