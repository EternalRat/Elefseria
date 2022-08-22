const { MessageEmbed, Message, User, GuildMember } = require("discord.js");

/**
 * 
 * @param {Document} user 
 * @param {Message} msg 
 * @param {GuildMember} target 
 */
async function Seewarn(user, msg, target)
{
    let count = user.get("count");
    const embed = new MessageEmbed()
        .setTitle(`Warnings of ${target.user.username}`)
        .addFields({
            name:`Warnings:`,
            value: `${count}`,
            inline: true
        })
        .setThumbnail(msg.guild.iconURL())
        .setAuthor({
            name: msg.author.username, 
            iconURL: msg.author.avatarURL()
        })
        .setTimestamp()
    let reasons = new Map();
    let userTag = new Array();
    user.userTag.forEach(value => {
        userTag.push(value)
    });
    user.reason.forEach((key, value) => {
        reasons.set(key, value)
    });
    let i = 0;
    reasons.forEach((key, reason) => {
        embed.addField(`Warn #${key} by **${userTag[i++]}**`, `**Reason:** ${reason}`)
    })
    msg.channel.send({embeds: [embed]});
}

module.exports = {
    Seewarn
}