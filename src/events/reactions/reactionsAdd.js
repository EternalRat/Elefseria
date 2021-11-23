const { Client, MessageReaction, GuildMember, User } = require('discord.js');
const MessageModel = require('../../utils/database/model/models');
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
        let addMemberRole = (emojiRoleMappings) => {
            if(emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
                let roleId = emojiRoleMappings[reaction.emoji.id];
                let role = reaction.message.guild.roles.cache.get(roleId);
                let member = reaction.message.guild.members.cache.get(user.id);
                if(role && member) {
                    member.roles.add(role);
                }
            }
        }
        if (user.id === client.user.id) return
        if(reaction.message.partial) {
            await reaction.message.fetch();
            let { id } = reaction.message;
            try {
                let msgDocument = await MessageModel.findOne({ messageId: id });
                if(msgDocument) {
                    client.cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
                    addMemberRole(msgDocument.emojiRoleMappings);
                }
            } catch(err) {
                console.log(err);
            }
        } else {
            if (client.cachedMessageReactions.get(reaction.message.id)) {
                addMemberRole(client.cachedMessageReactions.get(reaction.message.id));
            }
        }
    }
}