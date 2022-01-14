require('dotenv').config();
const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const WarnModel = require("../../utils/database/models/warn")
const OldWarnModel = require("../../utils/database/models/oldwarnmodel")
const NbrWarnModel = require("../../utils/database/models/nbrwarn")
const { MessageEmbed, Client, Message } = require("discord.js");

module.exports = class WarnCommand extends BaseCommand {
  constructor() {
    super('warn', 'moderation', [], 5, true, "Warn an user", "<userId/user> <Reason>", new PermissionGuard(["MANAGE_MESSAGES"]));
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
        let target = (await msg.guild.members.fetch(msg.mentions.users.first())) || msg.guild.members.cache.find(m => m.id === args[0]);
        var embedColor = '#ffffff';
        var missingArgsEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(msg.author.username, msg.author.avatarURL())
            .setTitle("Missing arguments")
            .setDescription(`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``)
            .setTimestamp();
        if (!target) return msg.channel.send({embeds: [missingArgsEmbed]});
        if (msg.guild.members.cache.get(msg.author.id).roles.highest.position <= target.roles.highest.position) return msg.channel.send("You can't warn this user");
        let wReason = new Map();
        let user = await WarnModel.findOne({ userId: target.id, guildId: msg.guild.id });
        let oldUser = await OldWarnModel.findOne({ userId: target.id, guildId: msg.guild.id });
        let Count = await NbrWarnModel.findOne({ Id: client.user.id });
        if (!Count) {
            let newCount = new NbrWarnModel({
                Id: client.user.id,
                Count: 1
            });
            newCount.save().catch(err => console.log(err));
            wReason.set('1', args.slice(1).join(' '));
        } else {
            let countall = Count.get("Count")
            Count.set("Count", ++countall);
            Count.save().catch(err=>console.log(err))
            wReason.set(`${Count.get("Count")}`, args.slice(1).join(' '));
        }
        if (!user) {
            let warn = new WarnModel({
                userId: target.id,
                guildId: msg.guild.id,
                Count: 1,
                Reason: wReason,
                userTag: [msg.author.tag]
            });
            let oldwarn = new OldWarnModel({
                userId: target.id,
                guildId: msg.guild.id,
                Count: 1,
                Reason: wReason,
                userTag: [msg.author.tag]
            });
            warn.save().catch(err => console.log(err));
            oldwarn.save().catch(err => console.log(err))
            msg.channel.send(`⚠️ Warned ${target.user.tag}`);
            const warnE = new MessageEmbed()
                .setTitle("You've been warned !")
                .setAuthor(msg.author.username, msg.author.avatarURL())
                .setDescription(`Reason :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)
            target.send({embeds: [warnE]})
            return;
        }
        saveDB(user, args, msg, Count)
        saveDB(oldUser, args, msg, Count)
        msg.channel.send(`⚠️ Warned ${target.user.tag}`);
        const warnE = new MessageEmbed()
            .setTitle("You've been warned !")
            .setAuthor(msg.author.username, msg.author.avatarURL())
            .setDescription(`Reason :\n\`\`\`${args.slice(1).join(' ')}\`\`\``)
        target.send({embeds: [warnE]})
    }
}

function saveDB(user, args, msg, Count) {
    let count = user.get("Count");
    count += 1;
    let newMap2 = new Map()
    newMap2.set(`${Count.get("Count")}`, args.slice(1).join(' '));
    let tag = new Array();
    user.userTag.forEach(value => {
      tag.push(value)
    })
    tag.push(msg.author.tag)
    user.set("Count", count);
    user.set("Reason", newMap2);
    user.set("userTag", tag);
    user.save().catch(err => console.log(err));
}