const BaseEvent = require("../../utils/structures/BaseEvent");
const {MessageEmbed, Client, GuildMember} = require("discord.js")
const UsersChannel = require("../../utils/database/models/userscount");
const User = require("../../class/UserClass");

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
    const user = new User(client, member);
    let res = user.raidProtect();
    if (res === 1)
      return;
    await user.sendJoinMsg();
    await user.incrementCounter();
  }
}