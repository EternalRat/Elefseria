const BaseCommand = require('../../utils/structures/BaseCommand');
const channels = require("../../utils/database/models/channels");
const { Client, Message, Guild, TextChannel } = require('discord.js');
const PermissionGuard = require('../../utils/PermissionGuard');

module.exports = class ChannelCommand extends BaseCommand {
  constructor() {
    super('config-channel', 'settings', ['cchannel', 'c-channel', 'config-ch'], 3, true, "Configure channel", "<type> <create/remove> [channel]", new PermissionGuard(["MANAGE_CHANNELS"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array} args 
   */
  async run(client, msg, args) {
    if (args.length !== 2 && args.length !== 3) return;
    const channels = ['member', 'user', 'bot', 'role', 'channel', 'invite', 'msg', 'voice', 'join', 'left', /* , 'normal', 'premium', 'beta' */];
    if (channels.find((channel) => channel === args[0]) === undefined)
      return msg.channel.send(`As a first argument you must provide one of these : \`${channels.join(', ')}\``);
    if (args[1] === "create")
      await create(args[0].toLowerCase(), msg.guild, msg);
    else if (args[1] === "remove")
      await remove(args[0].toLowerCase(), msg.guild, msg.channel);
  }
}

/**
 * 
 * @param {String} channelType 
 * @param {Guild} guild 
 * @param {Message} msg 
 */
async function create(channelType, guild, msg) {
  const chann = await channels.findOne({ guildId: guild.id });
  if (chann) {
    const channels = ['member', 'user', 'bot', 'role', 'channel'];
    const wgchannels = ['join', 'left'];
    var channelId = 0;
    if (channels.find((channel) => channel === channelType) !== undefined) {
      var nbr = 0;
      if (channelType === 'member')
        nbr = (await guild.members.fetch()).size;
      else if (channelType === 'user')
        nbr = (await guild.members.fetch()).filter((member) => !member.user.bot).size;
      else if (channelType === 'bot')
        nbr = (await guild.members.fetch()).filter((member) => member.user.bot).size;
      else if (channelType === 'role')
        nbr = (await guild.roles.fetch()).size;
      else
        nbr = (await guild.channels.fetch()).size;
      channelId = (await createVoiceChannel(channelType.charAt(0).toUpperCase() + channelType.slice(1), msg, nbr)).id;
      channelType = `${channelType}CountChannel`;
    } else if (wgchannels.find((channel) => channel === channelType) !== undefined) {
      if (msg.mentions.channels.size === 0) return msg.channel.send('In order to add channel with join and left parameters you need to mention a channel.');
      channelId = msg.mentions.channels.first().id;
      channelType = `channel${channelType.charAt(0).toUpperCase() + channelType.slice(1)}`;
    } else {
      if (msg.mentions.channels.size === 0) return msg.channel.send('In order to add channel with invite, msg and voice parameters you need to mention a channel.');
      channelId = msg.mentions.channels.first().id;
      channelType = `${channelType}Log`;
    }
    chann.set(`${channelType}`, channelId);
    chann.save().catch(err => console.error(err));
    msg.channel.send("The channel has been added to the database.");
  } else return msg.channel.send('You should contact the developer since you weren\'t added to the database.');
}

/**
 * 
 * @param {String} channelName 
 * @param {Message} msg 
 * @param {Number} nbr
 * @returns 
 */
async function createVoiceChannel(channelName, msg, nbr) {
  return await msg.guild.channels.create(`👨 ${channelName} count : ${nbr} 👨`, {type: "GUILD_VOICE"});
}

/**
 * 
 * @param {String} channelType 
 * @param {Guild} guild 
 * @param {TextChannel} channel 
 * @returns 
 */
async function remove(channelType, guild, channel) {
  const ch = await channels.findOne({ guildId: guild.id });
  if (!ch) return msg.channel.send('You should contact the developer since you weren\'t added to the database.');
  const channels = ['member', 'user', 'bot', 'role', 'channel'];
  const wgchannels = ['join', 'left'];
  if (channels.find((channel) => channel === channelType) !== undefined)
    channelType = `${channelType}CountChannel`;
  else if (wgchannels.find((channel) => channel === channelType) !== undefined)
    channelType = `channel${channelType.charAt(0).toUpperCase() + channelType.slice(1)}`;
  else
    channelType = `${channelType}Log`;
  ch.set(`${channelType}`, undefined);
  ch.save().catch(err => console.error(err));
  channel.send("The channel has been removed from the database. You can now remove it from the server.");
}