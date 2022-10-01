const BaseCommand = require('../../utils/structures/BaseCommand');
const settings = require("../../utils/database/models/channels");
const { Client, Message, MessageEmbed } = require('discord.js');
const PermissionGuard = require('../../utils/PermissionGuard');

module.exports = class MsgChannelCommand extends BaseCommand {
  constructor() {
    super('msg-config-channel', 'settings', ['msg-cchannel', 'msg-c-channel', 'msg-config-ch'], 3, true, "Configure channel", "<type> <msg>", new PermissionGuard(["MANAGE_CHANNELS"]));
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
    if (args[0].toLowerCase() === 'help') {
      const helpEmbed = new MessageEmbed()
        .setTitle('msg-config-channel HELP')
        .setDescription('Here you will find the different variables available according to the types')
        .setFields(
          {
            name: 'invite',
            value: '`{memberMention}, {memberName}, {fakeCount}, {inviteCount}, {leftCount}, {inviter}, {inviterName}, {memberCreatedSince}, {memberCreatedDate}, {inviteCode}, {bonusCount}, {guildMemberCount}, {guildName}`',
            inline: true
          }, {
            name: 'join',
            value: '`{memberMention}, {memberName}, {memberCreatedDate}, {memberCreatedSince}, {guildMemberCount}, {guildName}`'
          }, {
            name: 'left',
            value: '`{memberMention}, {memberName}, {memberCreatedDate}, {memberCreatedSince}, {guildMemberCount}, {guildName}`'
          })
        .setAuthor(
          {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
          })
        .setColor('#FF7070')
        .setThumbnail(msg.guild.iconURL())
        .setFooter(
          {
            text: `Copyright - ${client.user.username}`,
            iconURL: client.user.displayAvatarURL()
          })
      msg.channel.send({embeds: [helpEmbed]});
      return;
    }
    if (args.length < 2) return;
    const channels = ['invite', 'join', 'left'];
    if (channels.find((channel) => channel === args[0].toLowerCase()) === undefined)
      return msg.channel.send(`As a first argument you must provide one of these : \`${channels.join(', ')}\``);
	  const type = args[0].toLowerCase() === 'invite' ? 'inviteMsg' : args[0].toLowerCase() + 'Msg';
    var finalMessage = msg.content.substring(msg.content.slice(client.prefix.length).indexOf(' ') + 2);
    finalMessage = finalMessage.substring(finalMessage.indexOf(' '));
    guildSettings.set(type, finalMessage);
    guildSettings.save().then(() => {
      msg.channel.send('The message got successfully saved.');
    }).catch(err => {
      console.log(err);
      msg.channel.send('Something wrong occured. Please try again later or contact the developer.');
    });
  }
}