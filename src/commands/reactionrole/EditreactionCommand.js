const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require("../../utils/PermissionGuard");
const { MessageCollector, Client, Message, Role } = require('discord.js');
const MessageModel = require("../../utils/database/models/reactionrole")

module.exports = class EditreactionCommand extends BaseCommand {
    constructor() {
        super('editreaction', 'reactionrole', ["reacte", "re"], 3, true, "Edit a reaction to a message with a role", "<messageId> <add/remove>", new PermissionGuard(["MANAGE_MESSAGES"]));
    }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array<String>} args 
     */
    async run(client, msg, args) {
        if (args.length !== 2) {
            let msg2 = await msg.channel.send("Arguments missing or too many arguments. Provide only 1 message id and add/remove.");
            await msg2.delete({ timeout: 3500 }).catch(err => console.log(err));
        } else {
            try {
                let fetchedMessage = await msg.channel.messages.fetch(args[0]);
                if (args[1] === "add")
                    addReaction(client, msg, fetchedMessage);
                else if (args[1] === "remove")
                    removeReaction(client, msg, fetchedMessage);
                else
                    msg.channel.send("The second argument must be add or remove.");
            } catch (err) {
                console.log(err);
                let message = await msg.channel.send("Invalid id. Message was not found.");
                await message.delete({ timeout: 3500 }).catch(err => console.log(err));
            }
        }
    }
}


/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Message<Boolean>} fetchedMessage 
 */
async function removeReaction(client, msg, fetchedMessage) {
    let msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;
    let exp = await msg.channel.send("Please provide all of the emoji names with the role name, one by one, separated with a comma.\ne.g: snapchat,snapchat, where the emoji name comes first, role name comes second.\n\
    Once you're done, just type '?done' and it'll be fine!");
    let collector = new MessageCollector(msg.channel, { filter: msgCollectorFilter.bind(null, msg)});
    let emojiMappings = new Array();
    collector.on('collect', msg => {
        if (msg.content.toLowerCase() === '?done') {
            collector.stop('done command was issued.');
            msg.channel.send("Done.").then(msg => msg.delete({ timeout: 3500 }))
            msg.delete();
            exp.delete()
            return;
        }
        let emojiName = msg.content;
        if (!emojiName) return;
        let emoji = msg.guild.emojis.cache.find(role => role.name.toLowerCase() === emojiName.toLowerCase());
        if (!emoji) {
            msg.channel.send("Emoji does not exist. Try again.")
                .then(msg => msg.delete({ timeout: 2000 }))
                .catch(err => console.log(err));
            return;
        }
        emojiMappings.push(emoji.id);
        msg.delete({ timeout: 3500 });
    });
    collector.on('end', async (collected, reason) => {
        let findMsgDocument = await MessageModel.findOne({ messageId: fetchedMessage.id })
        if (!findMsgDocument) {
            msg.channel.send("A role reaction doesn't exist for this message...");
        } else {
            let mapping = findMsgDocument.get('emojiRoleMappings');
            emojiMappings.forEach(async emojiId => {
                fetchedMessage.reactions.cache.get(emojiId).remove();
                delete mapping[emojiId];
            });
            await findMsgDocument.deleteOne();
            let dbMsgModel = new MessageModel({
                guildId: msg.guild.id,
                messageId: fetchedMessage.id,
                emojiRoleMappings: mapping
            });
            dbMsgModel.save()
                .catch(err => console.log(err));
            client.cachedMessageReactions.set(fetchedMessage.id, mapping);
        }
    });
}

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {Message<Boolean>} fetchedMessage 
 */
async function addReaction(client, msg, fetchedMessage) {
    let msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;
    let exp = await msg.channel.send("Please provide all of the emoji names with the role name, one by one, separated with a comma.\ne.g: snapchat,snapchat, where the emoji name comes first, role name comes second.\n\
    Once you're done, just type '?done' and it'll be fine!");
    let collector = new MessageCollector(msg.channel, { filter: msgCollectorFilter.bind(null, msg)});
    let emojiRoleMappings = new Object();
    collector.on('collect', msg => {
        let { cache } = msg.guild.emojis;
        if (msg.content.toLowerCase() === '?done') {
            collector.stop('done command was issued.');
            msg.channel.send("Done.").then(msg => msg.delete({ timeout: 3500 }))
            msg.delete();
            exp.delete()
            return;
        }
        let [emojiName, roleName] = msg.content.split(/,\s+/);
        if (!emojiName && !roleName) return;
        let emoji = cache.find(emoji => emoji.name.toLowerCase() === emojiName.toLowerCase());
        if (!emoji) {
            msg.channel.send("Emoji does not exist. Try again.")
                .then(msg => msg.delete({ timeout: 2000 }))
                .catch(err => console.log(err));
            return;
        }
        let role = msg.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
        if (!role) {
            msg.channel.send("Role does not exist. Try again.")
                .then(msg => msg.delete({ timeout: 2000 }))
                .catch(err => console.log(err));
            return;
        }
        fetchedMessage.react(emoji)
            .catch(err => console.log(err));
        emojiRoleMappings[emoji.id] = role.id;
        msg.delete({ timeout: 3500 });
    });
    collector.on('end', async (collected, reason) => {
        let findMsgDocument = await MessageModel.findOne({ messageId: fetchedMessage.id })
        if (!findMsgDocument) {
            msg.channel.send("A role reaction doesn't exist for this message...");
        } else {
            let oldMapping = findMsgDocument.get('emojiRoleMappings');
            let newMappings = {...oldMapping, ...emojiRoleMappings};
            client.cachedMessageReactions.set(fetchedMessage.id, newMappings);
            findMsgDocument.set('emojiRoleMappings', newMappings);
            findMsgDocument.save().catch(err=>console.log(err));
        }
    });
}