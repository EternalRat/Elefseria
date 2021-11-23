const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require('../../utils/PermissionGuard');
const { MessageEmbed, Message, Client } = require("discord.js");
const fs = require("fs");
const ms = require("ms")
require('dotenv').config();

module.exports = class MuteCommand extends BaseCommand {
  constructor() {
    super('mute', 'moderation', [], 5, true, "Mute an user", "<userId/user> [duration]", new PermissionGuard(["MANAGE_MESSAGES"]));
  }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    async run(client, msg, args) {
        let target = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.cache.get(args[0])
        var embedColor = '#ffffff'
        var missingArgsEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(msg.author.username, msg.author.avatarURL())
            .setTitle("Missing arguments")
            .setDescription(`Usage: \`${process.env.DISCORD_BOT_PREFIX}${this.name} ${this.usage}\``)
            .setTimestamp();
        if (!target) return msg.channel.send(missingArgsEmbed)
        msg.delete().catch()
        if (msg.guild.member(msg.author).roles.highest.position <= target.roles.highest.position) return msg.channel.send("That person can't be kicked!");
        let role = msg.guild.roles.cache.find(r => r.name === "Muted");
        if (!role) {
            try {
                role = await msg.guild.roles.create({
                    data: {
                        name: "Muted",
                        color: "#000000",
                        permissions: []
                    }
                });
                msg.guild.channels.cache.forEach(async (channel, id) => {
                    channel.updateOverwrite(role, {
                        deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'SPEAK']
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        if(target.roles.cache.has(role.id)) return msg.channel.send("This user is already muted")
        var time;
        time = !args[1] ? ms("999d") : ms(args[1])
        client.mutes[target.id] = {
            guild: msg.guild.id,
            time: Date.now() + time
        }
        await target.roles.add(role);

        fs.writeFile("./src/utils/json/mute.json", JSON.stringify(client.mutes, null, 4), err => {
            if (err) throw err;
            msg.channel.send(`${target} has been muted by ${msg.author}`);
        })
    }
}