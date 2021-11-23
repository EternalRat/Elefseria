const { Message } = require("discord.js");
const TranscriptTicket = require('../../utils/transcriptTicket');

module.exports = class Ticket {

    constructor(){}

    /**
     * 
     * @param {Message} msg 
     */
    closeTicket(msg) {
        msg.channel.overwritePermissions([
            {
                id: msg.guild.id,
                deny: ["VIEW_CHANNEL"]
            }
        ])
    }

    /**
     * 
     * @param {Message} msg 
     */
    transcriptTicket(msg) {
        let [type, nothing, ...username] = msg.channel.name.replace(/-/g, " ").replace("ticket", " ").split(' ').filter(e => e !== '')
        let newTranscript = new TranscriptTicket(msg.channel.guild, msg.channel.name, "EternalRat", username, type);

        newTranscript.doTranscript(msg.channel.messages).then(() => newTranscript.createFile());
    }

    /**TODO
     * A FAIRE
     * @param {Message} msg 
     */
    createTicket(msg) {

    }

    /**
     * 
     * @param {Message} msg 
     */
    addPersonTicket(msg, args) {
        let member = msg.guild.member(msg.mentions.users.first()) || msg.guild.member(args[0])

        if (!member) return;
        msg.channel.updateOverwrite(member, {
            VIEW_CHANNEL: true
        })
    }
}