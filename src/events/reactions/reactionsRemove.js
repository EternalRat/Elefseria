const MessageModel = require('../../utils/database/models/reactionrole');
const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class MessageReactionRemoveEvent extends BaseEvent {
    constructor () {
        super('messageReactionRemove')
    }

    async run (client, reaction, user) {
        let removeMemberRole = (emojiRoleMappings) => {
            if(emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
                let roleId = emojiRoleMappings[reaction.emoji.id];
                let role = reaction.message.guild.roles.cache.get(roleId);
                let member = reaction.message.guild.members.cache.get(user.id);
                if(role && member) {
                    member.roles.remove(role);
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
                    removeMemberRole(msgDocument.emojiRoleMappings);
                }
            } catch(err) {
                console.log(err);
            }
        } else {
            if (client.cachedMessageReactions.get(reaction.message.id))
                removeMemberRole(client.cachedMessageReactions.get(reaction.message.id));
        }
    }
}