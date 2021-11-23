const BaseCommand = require('../../utils/structures/BaseCommand');
const {MessageEmbed, Client, Message} = require("discord.js");
const {parseZone} = require("moment")

module.exports = class ServerinfoCommand extends BaseCommand {
  constructor() {
    super('serverinfo', 'utils', ["server", "infoserv"], 3, true, "Get informations about the server", null, null);
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    run(client, msg, args) {
        const serverInfo = new MessageEmbed()
        .setTitle(`Informations about ${msg.guild.name}`)
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .addFields({
            name: "Date of creation:",
            value: `${parseZone(msg.guild.createdAt).format("dddd Do MMMM in YYYY, HH:mm:ss")}`,
            inline: true
        },{
            name: "Guild owner:",
            value: msg.guild.owner,
            inline: true
        },{
            name: "Guild ID:",
            value: msg.guild.id,
            inline: true
        },{
            name: "Region:",
            value: msg.guild.region, 
            inline: true
        },{
            name: "Verification level:",
            value: msg.guild.verificationLevel,
            inline: true
        },{
            name: "Number of roles:",
            value: msg.guild.roles.cache.size,
            inline: true
        },{
            name: "Number of members:",
            value: msg.guild.members.cache.filter(member => !member.user.bot).size,
            inline: true
        },{
            name: "Number of bot:",
            value: msg.guild.members.cache.filter(member => member.user.bot).size,
            inline: true
        },{
            name: "Number of channels:",
            value: msg.guild.channels.cache.size,
            inline: true
        })
        .setTimestamp()
        .setThumbnail(msg.guild.iconURL())
        .setFooter(`Copyright - ${client.user.username}`, client.user.displayAvatarURL())
        .setColor("RED")
        msg.channel.send(serverInfo)
    }
}