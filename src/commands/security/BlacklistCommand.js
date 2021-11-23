const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require("../../utils/PermissionGuard");
const blacklist = require('../../utils/database/models/blacklist');
const { Client, Message } = require('discord.js');

module.exports = class BlacklistCommand extends BaseCommand {
  constructor() {
    super('blacklist', 'security', [], 3, true, "Add an user to the blacklist", "<user/userId> <reason>", new PermissionGuard(["ADMINISTRATOR"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array} args 
   */
  async run(client, message, args) {
    let target = message.guild.members.cache.get(message.mentions.users.first()).id || message.guild.member(message.mentions.users.first()).id || args[0]
    if (!target) return message.channel.send(`Usage: ${this.usage}`);
    let reason = args.slice(1).join(" ");
    if (!reason) return message.channel.send(`Usage: ${this.usage}`);
    let findBan = await blacklist.findOne({ userId: target })
    if (!findBan) {
      let dbBanModel = new blacklist({
        userId: target,
        Reason: reason
      })
      dbBanModel.save().catch(err => console.log(err))
      message.channel.send("This user has been added to the blacklist")
    } else {
      const filter = (reaction, user) => ["👍", "👎"].includes(reaction.emoji.name) && user.id === message.author.id
      message.channel.send("This user is already in the blacklist, do you want to remove it ? Use the current reaction bellow.").then(message => {
        message.react("👎")
        message.react("👍")
        message.awaitReactions(filter, {
          max: 1,
          time: 30000,
          errors: ["time"]
        }).then(async (collected) => {
          const reaction = collected.first()
          switch (reaction.emoji.name) {
            case "👍":
              blacklist.deleteOne(findBan, function(err) {
                  if (err) console.log(err)
              })
              message.channel.send("This user has been removed from the blacklist.")
              break
            case "👎":
              message.channel.send("Okay boss.")
              break
          }
        })
      })
    }
  }
}