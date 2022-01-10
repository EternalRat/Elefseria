const { Message } = require("discord.js");
const TranscriptTicket = require('../../utils/transcriptTicket');

module.exports = class Ticket {

    constructor(){}

    /**
     * 
     * @param {Message} msg 
     */
    closeTicket(msg) {
        msg.channel.permissionOverwrites.edit(msg.guild.id, {
                "VIEW_CHANNEL": false
        });
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
     * @param {Array<String>} args
     */
    async addPersonTicket(msg, args) {
        console.log("test", args);
        let member = (await msg.guild.members.fetch(msg.mentions.users.first())) || msg.guild.members.cache.find(m => m.id === args[0])
        console.log("test", member);
        if (!member) return;
        msg.channel.permissionOverwrites.edit(member, {
            VIEW_CHANNEL: true
        });
    }
}