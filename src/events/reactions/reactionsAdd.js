const { Client, MessageReaction, GuildMember, User } = require('discord.js');
const BaseEvent = require("../../utils/structures/BaseEvent");
const Reaction = require("../../class/ReactionClass");

module.exports = class MessageReactionAddEvent extends BaseEvent {
    constructor () {
        super('messageReactionAdd')
    }

    /**
     * 
     * @param {Client} client 
     * @param {MessageReaction} reaction 
     * @param {GuildMember} user 
     */
    async run (client, reaction, user) {
        if (user.id === client.user.id) return
        const react = new Reaction(client, reaction, user);
        if (!(await react.addRole()) && !(await react.checkBlacklist()))
            await react.createTicket();
    }
}

