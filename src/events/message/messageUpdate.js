const BaseEvent = require("../../utils/structures/BaseEvent");
const {MessageEmbed, Client, Message} = require("discord.js")

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
            .setAuthor(newMsg.author.username, newMsg.author.displayAvatarURL())
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
            .setFooter(client.user.username, client.user.displayAvatarURL())
        channel.send({embeds: [embed]});
    }
}