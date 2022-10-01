const BaseEvent = require("../../utils/structures/BaseEvent");
const {MessageEmbed, Message, Client} = require("discord.js")
const fs = require('fs')

module.exports = class MessageDeleteEvent extends BaseEvent {
    constructor () {
        super('messageDelete')
    }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run (client, msg) {
        if (msg.author.bot) return;
        let channel = msg.guild.channels.cache.find(ch => ch.name === "msgs-logs")
        if (msg.cleanContent === undefined || msg.cleanContent === null) return
        if (msg.cleanContent === "") return
        if (msg.cleanContent.length > 1024) return
        if (!channel) return
        const embed = new MessageEmbed()
            .setAuthor({
                name: msg.author.username, 
                iconURL: msg.author.displayAvatarURL()
            })
            .setDescription(`**A message has been deleted in ${msg.guild.channels.cache.find(ch => ch === msg.channel)}**`)
            .setThumbnail(msg.guild.iconURL())
            .addFields({
                name: "Old message:",
                value: msg.cleanContent
            })
            .setTimestamp()
            .setFooter({
                text: client.user.username, 
                iconURL: client.user.displayAvatarURL()
            })
        channel.send({embeds: [embed]})
            
        var dir = './logs/' + msg.guild.name + "/";

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFile(dir + new Date().toISOString().split('T')[0],`Deletion - ${new Date().toISOString().split('T')[1]} - ${msg.cleanContent} - ${msg.channel.name} - ${msg.author.username}\n`, function (err) {
            if (err) throw err;
        });
    }
}