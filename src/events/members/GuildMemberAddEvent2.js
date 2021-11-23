// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
const BaseEvent = require('../../utils/structures/BaseEvent');
const SecConfig = require("../../utils/database//models/config");
const blackList = require("../../utils/database/models/blacklist")
const playerTab = require("../../utils/playerTab")
const { Client, GuildMember } = require('discord.js');
var lastTimestamp = 0;

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
    var guildConfig = await SecConfig.findOne({guildId: member.guild.id})
    if (!guildConfig) return;
    if (guildConfig.get("raidmode") === true) {
      member.send("Kick for : Raidmode on, come back later")
      (await (await client.guilds.fetch(member.guild.id)).members.fetch(member)).kick("RaidMode actif")
    }
    let banlist = await blackList.findOne({userId: member.user.id})
    if (banlist && guildConfig.get("blacklist") === true) {
      (await member.guild.members.fetch(member)).ban("Blacklisted")
    }
    playerTab.addTab(member.user.id);
    if ((member.joinedTimestamp - lastTimestamp) < (guildConfig.get("time") * 1000)) {
      var lengthUser = playerTab.getLength();
      if (lengthUser >= guildConfig.get("people")) {
        var j = 0
        for (; j < lengthUser; j++) {
          (await member.guild.members.fetch(playerTab.getUser(i))).ban("RAID")
          let dbblackList = new blackList({
            userId: member.user.id,
            Reason: "raid"
          })
          dbblackList.save().catch(err => console.log(err))
        }
        if (j === lengthUser) {
          playerTab.removeTab();
          lastTimestamp = 0
          member.guild.owner.send("Un raid a été évité et l'antiraid a été activé !")
        }
      }
    } else {
      lastTimestamp = member.joinedTimestamp
    }
  }
}