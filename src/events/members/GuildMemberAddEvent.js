const BaseEvent = require("../../utils/structures/BaseEvent");
const {MessageEmbed, Client, GuildMember} = require("discord.js")
const UsersChannel = require("../../utils/database/model/userscount");
const channels = require("../../utils/database/model/channels");

module.exports = class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  /**
   * 
   * @param {Client} client 
   * @param {GuildMember} member 
   */
  async run(client, member) {
    const addingMember = new MessageEmbed()
      .setTitle("Nouvel arrivant !")
      .setAuthor(member.user.username, member.user.avatarURL())
      .addField(`**Bienvenue à ${member.user.username}**`, "N'oublie pas d'aller lire le règlement.")
      .setThumbnail(member.guild.iconURL())
      .setTimestamp()
      .setFooter("Copyright - " + client.user.username, client.user.avatarURL())
    let channelDb = await channels.findOne({guildId: member.guild.id})
    if (channelDb) {
      let channel = member.guild.channels.cache.get(channelDb.get("channelWelcId"))
      if (channel)
        channel.send(addingMember)
    }
    let users = await UsersChannel.findOne({ guildId: member.guild.id })
    if (users) {
      let count = (await member.guild.members.fetch()).filter(member => !member.user.bot).size
      member.guild.channels.cache.get(users.get("channelId")).setName(`👨 Users count : ${count} 👨`)
    }
  }
}