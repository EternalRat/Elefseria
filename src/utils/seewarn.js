const { MessageEmbed, Message, User } = require("discord.js");

/**
 * 
 * @param {Document} user 
 * @param {Message} msg 
 * @param {User} target 
 */
async function Seewarn(user, msg, target)
{
    let count = user.get("Count");
    const embed = new MessageEmbed()
        .setTitle(`Warnings of ${target.tag}`)
        .addFields({
            name:`${choice1} warnings:`,
            value: `${count}`,
            inline: true
        })
        .setThumbnail(msg.guild.iconURL())
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setTimestamp()
    let Reason = new Map();
    let userTag = new Array();
    user.userTag.forEach(value => {
        userTag.push(value)
    })
    user.Reason.forEach((key, value) => {
        Reason.set(key, value)
    });
    let i = 0;
    Reason.forEach((key, reason) => {
        embed.addField(`Warn #${key} by **${userTag[i++]}**`, `**Reason:** ${reason}`)
    })
    msg.channel.send({embeds: [embed]});
}

module.exports = {
    Seewarn
}