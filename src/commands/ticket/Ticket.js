const { Message } = require("discord.js");
const TranscriptTicket = require('../../utils/transcriptTicket');

module.exports = class Ticket {

    /**
     * 
     * @param {Message} msg 
     */
    constructor(msg){
        this.msg = msg;
    }

    /**
     * 
     */
    closeTicket() {
        this.msg.channel.overwritePermissions([
            {
                id: this.msg.guild.id,
                deny: ["VIEW_CHANNEL"]
            }
        ])
    }

    /**
     * 
     */
    transcriptTicket() {
        let [type, nothing, ...username] = this.msg.channel.name.replace(/-/g, " ").replace("ticket", " ").split(' ').filter(e => e !== '')
        let newTranscript = new TranscriptTicket(this.msg.channel.guild, this.msg.channel.name, "EternalRat", username, type);

        newTranscript.doTranscript(this.msg.channel.messages).then(() => newTranscript.createFile());
    }

    /**
     * 
     * @param {Array<String>} args 
     */
    addPersonTicket(args) {
        let member = this.msg.guild.member(this.msg.mentions.users.first()) || this.msg.guild.member(args[0])

        if (!member) return;
        this.msg.channel.updateOverwrite(member, {
            VIEW_CHANNEL: true
        })
    }

    /**
     * 
     * @param {Array<String>} args 
     */
    removePersonTicket(args) {
        let member = this.msg.guild.member(this.msg.mentions.users.first()) || this.msg.guild.member(args[0])

        if (!member) return;
        this.msg.channel.updateOverwrite(member, {
            VIEW_CHANNEL: false
        })
    }
}