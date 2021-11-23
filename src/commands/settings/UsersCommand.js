const BaseCommand = require('../../utils/structures/BaseCommand');
const UsersChannel = require("../../utils/database/models/userscount");
const { Client, Message } = require('discord.js');
const PermissionGuard = require('../../utils/PermissionGuard');

module.exports = class UsersCommand extends BaseCommand {
  constructor() {
    super('users', 'channels', [], 3, true, "Configure the users count channel", "<create/remove>", new PermissionGuard(["MANAGE_CHANNELS"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array} args 
   */
  run(client, msg, args) {
    if (args.length != 1) return;
    if (args[0] === "create")
      create_giveaway(args, msg.guild, msg.channel, msg)
    else if (args[0] === "remove")
      remove_giveaway(args, msg.guild, msg.channel)
  }
}

async function create_giveaway(args, guild, channel, msg) {
  const chann = await UsersChannel.findOne({ guildId: guild.id })
  if (chann) {
    channel.send("The users channel has already been set")
  } else {
    let nbr = guild.memberCount
    msg.guild.channels.create(`👨 Users count : ${nbr} 👨`, {type: "voice"}).then(ch => {
      let dbChannel = new UsersChannel({
        guildId: guild.id,
        channelId: ch.id
      })
      dbChannel.save().catch(err => console.log(err))
      msg.channel.send("The giveaway channel has been set.")
    })
  }
}

async function remove_giveaway(args, guild, channel) {
  const ch = await UsersChannel.findOne({ guildId: guild.id })
  if (!ch) return;
  const chann = ch.get("channelId")
  guild.channels.cache.get(chann).delete()
  UsersChannel.deleteOne(ch, function(err) {
    if (err) console.log(err)
  })
  channel.send("The channel has been removed.")
}