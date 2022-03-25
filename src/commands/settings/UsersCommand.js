const BaseCommand = require('../../utils/structures/BaseCommand');
const channels = require("../../utils/database/models/channels");
const { Client, Message, Guild, TextChannel } = require('discord.js');
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
      create(args.slice(1), msg.guild, msg.channel, msg)
    else if (args[0] === "remove")
      remove(args.slice(1), msg.guild, msg.channel)
  }
}

/**
 * 
 * @param {Array<String>} args 
 * @param {Guild} guild 
 * @param {TextChannel} channel 
 * @param {Message} msg 
 */
async function create(args, guild, channel, msg) {
  const chann = await channels.findOne({ guildId: guild.id });
  if (chann) {
    channel.send("The users channel has already been set");
  } else {
    let nbr = guild.memberCount;
    msg.guild.channels.create(`👨 Users count : ${nbr} 👨`, {type: "GUILD_VOICE"}).then(ch => {
      chann.set("countChannel", ch.id);
      msg.channel.send("The giveaway channel has been set.");
    });
  }
}

async function remove(args, guild, channel) {
  const ch = await channels.findOne({ guildId: guild.id });
  if (!ch) return;
  const chann = ch.get("countChannel");
  guild.channels.cache.get(chann).delete();
  ch.set("countChannel", undefined);
  channel.send("The channel has been removed.");
}