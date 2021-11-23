const { MessageEmbed, Message, User } = require("discord.js");

/**
 * 
 * @param {Document} user 
 * @param {Document} oldUser 
 * @param {Message} msg 
 * @param {User} target 
 * @param {String} choice1 
 * @param {String} choice2 
 */
async function Seewarn(user, oldUser, msg, target, choice1, choice2)
{
    let count = user.get("Count");
    let oldCount = oldUser.get("Count");
    const embed = new MessageEmbed()
        .setTitle(`Warnings of ${target.tag}`)
        .addFields({
            name:`${choice1} warnings:`,
            value: `${count}`,
            inline: true
        },{
            name:`${choice2} warnings:`,
            value: `${oldCount}`,
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