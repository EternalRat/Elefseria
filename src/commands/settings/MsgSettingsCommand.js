const BaseCommand = require('../../utils/structures/BaseCommand');
const settings = require("../../utils/database/models/channels");
const { Client, Message } = require('discord.js');
const PermissionGuard = require('../../utils/PermissionGuard');

module.exports = class MsgChannelCommand extends BaseCommand {
  constructor() {
	super('msg-config', 'settings', ['msg-conf', 'msg-config-dm'], 3, true, "Configure if you want left/join channel send in dms or not.", "<type> <true/false>", new PermissionGuard(["MANAGE_CHANNELS"]));
  }

  /**
   * 
   * @param {Client} client 
   * @param {Message} msg 
   * @param {Array<String>} args 
   */
  async run(client, msg, args) {
	const guildSettings = await settings.findOne({guildId: msg.guild.id});
	if (!guildSettings) return msg.channel.send('There\'s no settings for this guild. Please contact the developer.');
	if (args.length !== 2) return;
	const channels = ['join', 'left'];
	if (channels.find((channel) => channel === args[0].toLowerCase()) === undefined)
		return msg.channel.send(`As a first argument you must provide one of these : \`${channels.join(', ')}\``);
	const type = args[0].toLowerCase() + 'MsgDM';
	const bool = args[1].toLowerCase() === 'true' ? true : false;
	guildSettings.set(type, bool);
	guildSettings.save().then(() => {
		msg.channel.send('The message got successfully saved.');
	}).catch(err => {
		console.log(err);
		msg.channel.send('Something wrong occured. Please try again later or contact the developer.');
	});
  }
}