const BaseEvent = require("../../utils/structures/BaseEvent");
const {MessageEmbed, Message, Client} = require("discord.js")

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
            .addField("Old message:", msg.cleanContent)
            .setTimestamp()
            .setFooter({
                text: client.user.username, 
                iconURL: client.user.displayAvatarURL()
            })
        channel.send({embeds: [embed]})
    }
}