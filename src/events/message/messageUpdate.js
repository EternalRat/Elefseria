const BaseEvent = require("../../utils/structures/BaseEvent");
const {MessageEmbed, Client, Message} = require("discord.js")
const fs = require('fs')

module.exports = class MessageupdateEvent extends BaseEvent {
    constructor () {
        super('messageUpdate')
    }

    /**
     * 
     * @param {Client} client 
     * @param {Message} oldMsg 
     * @param {Message} newMsg 
     */
    async run (client, oldMsg, newMsg) {
        if (!newMsg) return;
        if (!newMsg.author) return;
        if (newMsg.channel.type !== "GUILD_TEXT" || newMsg.cleanContent === oldMsg.cleanContent) return;
        if (newMsg.cleanContent.length > 1024 || (oldMsg.cleanContent && oldMsg.cleanContent.length > 1024)) return;
        let channel = newMsg.guild.channels.cache.find(ch => ch.name === "msgs-logs");
        if (!channel) return;
        const embed = new MessageEmbed()
            .setAuthor({
                name: newMsg.author.username, iconURL: newMsg.author.displayAvatarURL()
            })
            .setDescription(`**A [message](${newMsg.url}) has been updated in ${oldMsg.guild.channels.cache.find(ch => ch === oldMsg.channel)}**`)
            .setThumbnail(newMsg.guild.iconURL())
            .addFields({
                name:"Old message:",
                value:oldMsg.cleanContent ? oldMsg.cleanContent : "Couldn't retrieve the old message."
            }, {
                name:"New message:",
                value:newMsg.cleanContent
            })
            .setTimestamp()
            .setFooter({
                text: client.user.username, 
                iconURL: client.user.displayAvatarURL()
            })
        channel.send({embeds: [embed]});
        var dir = './logs/' + oldMsg.guild.name + '/';

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFile(dir + new Date().toISOString().split('T')[0],`Update - ${new Date().toISOString().split('T')[1]} - ${oldMsg.cleanContent} - ${newMsg.cleanContent} - ${newMsg.channel.name} - ${newMsg.author.username}\n`, function (err) {
            if (err) throw err;
        });
    }
}