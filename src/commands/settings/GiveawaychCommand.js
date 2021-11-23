const BaseCommand = require('../../utils/structures/BaseCommand');
const GiveAwayCH = require("../../utils/database/models/giveawaych");
const PermissionGuard = require("../../utils/PermissionGuard");
const { Client, Message, Guild, TextChannel } = require('discord.js');

module.exports = class GiveawaychCommand extends BaseCommand {
  constructor() {
    super('giveawaychannel', 'channels', ["givech"], 3, true, "Set the channel count for giveaway", "<create/remove> [nbr]", new PermissionGuard(["MANAGE_MESSAGES"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array} args 
   */
  run(client, msg, args) {
    if (args.length < 1) return;
    if (args[0] === "create")
      create_giveaway(args, msg.guild, msg.channel, msg)
    else if (args[0] === "remove")
      remove_giveaway(args, msg.guild, msg.channel)
  }
}

/**
 * 
 * @param {Array} args 
 * @param {Guild} guild 
 * @param {TextChannel} channel 
 * @param {Message} msg 
 */
async function create_giveaway(args, guild, channel, msg) {
  if (!args.length) return;
  if (args.length != 2) return;
  const nbr = new Number(args[1])
  const ch = await GiveAwayCH.findOne({ guildId: guild.id })
  if (ch) {
      const filter = (reaction, user) => ["👍", "👎", "❌"].includes(reaction.emoji.name) && user.id === msg.author.id
      channel.send("Do you want to update your giveaway? or delete it?\nupdate: 👍\ndelete: 👎\nnothing: ❌").then(msg => {
          msg.react("👎")
          msg.react("👍")
          msg.react("❌")
          msg.awaitReactions(filter, {
              max: 1,
              time: 30000,
              errors: ["time"]
          }).then(async (collected) => {
              let channel = ch.get("channelId")
              const reaction = collected.first()
              switch (reaction.emoji.name) {
                  case "👍":
                      GiveAwayCH.deleteOne(ch, function(err) {
                          if (err) console.log(err)
                      })
                      let dbChannel = new GiveAwayCH({
                          guildId: guild.id,
                          count: nbr,
                          channelId: channel
                      })
                      dbChannel.save().catch(err => console.log(err))
                      msg.channel.send("The giveaway channel has been changed.")
                      guild.channels.cache.get(channel).setName(`🎉 Giveaway : ${nbr} 🎉`)
                      break
                  case "👎":
                      guild.channels.cache.get(channel).delete()
                      GiveAwayCH.deleteOne(ch, function(err) {
                          if (err) console.log(err)
                      })
                      msg.channel.send("The giveaway channel has been removed.")
                      break
                  case "❌":
                      msg.channel.send("Okay boss!")
                      break
              }
          })
      })
  } else {
      guild.channels.create(`🎉 Giveaway : ${nbr} 🎉`, {type: "voice"}).then(ch => {
          let dbChannel = new GiveAwayCH({
              guildId: guild.id,
              count: nbr,
              channelId: ch.id
          })
          dbChannel.save().catch(err => console.log(err))
          channel.send("The giveaway channel has been set.")
      })
      
  }
}

/**
 * 
 * @param {Array} args 
 * @param {Guild} guild 
 * @param {TextChannel} channel
 */
async function remove_giveaway(args, guild, channel) {
  const ch = await GiveAwayCH.findOne({ guildId: guild.id })
  if (!ch) return;
  const chan = ch.get("channelId")
  GiveAwayCH.deleteOne(ch, function(err) {
      if (err) console.log(err)
  })
  guild.channels.cache.get(chan).delete()
  channel.send("The channel has been removed.")
}