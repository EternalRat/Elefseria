require('dotenv').config();
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const WarnModel = require("../../utils/database/models/warn")
const { MessageEmbed, Message, Client } = require("discord.js");
const { Document } = require('mongoose');

module.exports = class TopwarnsCommand extends BaseCommand {
  constructor() {
    super('topwarns', 'moderation', ["tw"], 5, true, "See the top 10 of warning users", null, new PermissionGuard(["MANAGE_MESSAGES"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array} args 
   */
  async run(client, msg, args) {
    let Top10 = await WarnModel.find({ guildId: msg.guild.id }).sort({ Count: -1 }).limit(10);
    if (!Top10) {
      msg.channel.send(`There is any warn in your server`);
      return;
    }
    topWarn(msg, Top10)
  }
}

/**
 * 
 * @param {Message} msg 
 * @param {Document} top10 
 */
async function topWarn(msg, top10)
{
    let info = '# - Warns - User\n';
    let i = 0;
    const linkBtn = new MessageActionRow().addComponents(
      new MessageButton()
          .setLabel("See the leaderboard")
          .setURL(`https://localhost:3000/warns/${msg.guild.id}`)
          .setStyle("LINK")
  );
    const embed = new MessageEmbed()
        .setTitle("Ranked list of warnings")
        .setTimestamp();
    top10.forEach(user => {
        if (user.get("Count") !== 0) {
          if (!msg.guild.members.cache.get(user.get("userId"))) {
            OldWarnModel.remove(user);
            WarnModel.remove(user);
          } else {
            info += `#${++i}:\t${user.get("Count")} - ${msg.guild.members.cache.get(user.get("userId")).user.tag}\n`
          }
        }
    });
    embed.setDescription(`\`\`\`${info}\`\`\``);
    msg.channel.send({embeds: [embed], components: [linkBtn]})
}