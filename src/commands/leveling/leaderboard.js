//TODO: Need to do website part for that
const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed, Client, Message, MessageActionRow, MessageButton } = require("discord.js");
const PermissionGuard = require('../../utils/PermissionGuard');
const XP = require("../../utils/database/models/exp");

module.exports = class Leaderboard extends BaseCommand {
	constructor() {
		super('ranks', 'leveling', ["levels", "leaderboard"], 3, true, "Display the top 3 and a link.", null);
	}

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array<String>} args 
     */
	async run(client, msg, args) {
        return msg.channel.send("This command isn't available right now.");
        const leaderboard = (await XP.find()).sort((a, b) => {
            return a < b;
        });
        const places = ["🥇", "🥈", "🥉"]
        const leader = new MessageEmbed()
            .setTitle("Leaderboard")
            .setColor("GREEN")
            .setThumbnail(msg.guild.iconURL);
        const linkBtn = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("See the leaderboard")
                .setURL(`https://localhost:3000/leaderboard/${msg.guild.id}`)
                .setStyle("LINK")
        );
        var desc = '';
        for (var i = 0; i < 3; i++) {
            if (leaderboard[i] === undefined)
                break;
            desc += `${places[i]} ${await msg.guild.members.fetch(leaderboard[i].userId)}\n➥ Niveau ${leaderboard[i].level} (${leaderboard[i].exp} xp)\n\n`;
        }
        leader.setDescription(desc);
        msg.channel.send({embeds: [leader], components: [linkBtn]});
	}
}