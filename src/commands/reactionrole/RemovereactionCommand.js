const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require("../../utils/PermissionGuard");
const { MessageCollector, Client, Message, Role } = require('discord.js');
const MessageModel = require("../../utils/database/models/reactionrole")

module.exports = class EditreactionCommand extends BaseCommand {
    constructor() {
        super('removereaction', 'reactionrole', ["reactr", "rr"], 3, true, "Remove reaction role on a message", "<messageId>", new PermissionGuard(["MANAGE_MESSAGES"]));
    }

    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array<String>} args 
     */
    async run(client, msg, args) {
        if (args.length !== 1) {
            let msg2 = await msg.channel.send("Arguments missing or too many arguments. Provide only 1 message id.");
            await msg2.delete({ timeout: 3500 }).catch(err => console.log(err));
        } else {
            try {
                let fetchedMessage = await msg.channel.messages.fetch(args[0]);
                let rMessage = await MessageModel.findOne({messageId: fetchedMessage.id});
                if (!rMessage) {
                    msg.channel.send("There's no role reaction linked to this message");
                } else {
                    await rMessage.deleteOne();
                    fetchedMessage.reactions.cache.forEach(reaction => {
                        reaction.remove();
                    });
                    client.cachedMessageReactions.delete(fetchedMessage.id);
                    msg.channel.send("The linked role reaction has been deleted successfully.")
                }
            } catch (err) {
                console.log(err);
                let message = await msg.channel.send("Invalid id. Message was not found.");
                await message.delete({ timeout: 3500 }).catch(err => console.log(err));
            }
        }
    }
}