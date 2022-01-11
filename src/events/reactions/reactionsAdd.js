const { Client, MessageReaction, GuildMember, User } = require('discord.js');
const MessageModel = require('../../utils/database/models/reactionrole');
const BaseEvent = require("../../utils/structures/BaseEvent");

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
        if (reaction.message.partial) {
            await reaction.message.fetch();
            let { id } = reaction.message;
            try {
                let msgDocument = await MessageModel.findOne({ messageId: id });
                if (msgDocument) {
                    client.cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
                    addMemberRole(client.cachedMessageReactions.get(reaction.message.id), reaction, user);
                }
            } catch(err) {
                console.log(err);
            }
        } else {
            if (client.cachedMessageReactions.get(reaction.message.id)) {
                addMemberRole(client.cachedMessageReactions.get(reaction.message.id), reaction, user);
            }
        }
    }
}

async function addMemberRole(emojiRoleMappings, reaction, user) {
    if(emojiRoleMappings[reaction.emoji.id]) {
        let roleId = emojiRoleMappings[reaction.emoji.id];
        let role = await reaction.message.guild.roles.fetch(roleId);
        let member = reaction.message.guild.members.cache.get(user.id);
        if (role && member) {
            member.roles.add(role);
        }
    }
}