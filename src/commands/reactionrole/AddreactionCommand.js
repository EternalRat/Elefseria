const BaseCommand = require('../../utils/structures/BaseCommand');
const PermissionGuard = require("../../utils/PermissionGuard");
const { MessageCollector } = require('discord.js');
const MessageModel = require("../../utils/database/models/reactionrole")

module.exports = class AddreactionCommand extends BaseCommand {
	constructor() {
		super('addreaction', 'reactionrole', ["reacta", "ra"], 3, true, "Add a reaction to a message with a role", "<messageId>", new PermissionGuard(["MANAGE_MESSAGES"]));
	}

	async run(client, msg, args) {
		let msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;
		if(args.length !== 1) {
			let msg2 = await msg.channel.send("Too many arguments. Must only provide 1 message id");
			await msg2.delete({ timeout: 3500 }).catch(err => console.log(err));
		} else {
			try {
				let fetchedMessage = await msg.channel.messages.fetch(args[0]);
				if(fetchedMessage) {
					let exp = await msg.channel.send("Please provide all of the emoji names with the role name, one by one, separated with a comma.\ne.g: snapchat,snapchat, where the emoji name comes first, role name comes second.\n\
					Once you're done, just type '?done' and it'll be fine!");
					let collector = new MessageCollector(msg.channel, {filter: msgCollectorFilter.bind(null, msg), time: 10000});
					let emojiRoleMappings = {};
					collector.on('collect', msg => {
						let { cache } = msg.guild.emojis;
						if(msg.content.toLowerCase() === '?done') {
							collector.stop('done command was issued.');
							msg.channel.send("Done.").then(msg => msg.delete({timeout:3500}))
							msg.delete();
							exp.delete()
							return;
						}
						let [ emojiName, roleName ] = msg.content.split(/,\s+/);
						if(!emojiName && !roleName) return;
						let emoji = cache.find(emoji => emoji.name.toLowerCase() === emojiName.toLowerCase());
						if(!emoji) {
							msg.channel.send("Emoji does not exist. Try again.")
								.then(msg => msg.delete({ timeout: 2000 }))
								.catch(err => console.log(err));
							return;
						}
						let role = msg.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
						if(!role) {
							msg.channel.send("Role does not exist. Try again.")
								.then(msg => msg.delete({ timeout: 2000 }))
								.catch(err => console.log(err));
							return;
						}
						fetchedMessage.react(emoji)
								.catch(err => console.log(err));
						emojiRoleMappings[emoji.id] = role.id;
						msg.delete({timeout:3500});
					});
					collector.on('end', async (collected, reason) => {
							let findMsgDocument = await MessageModel
								.findOne({ messageId: fetchedMessage.id })
								.catch(err => console.log(err));
							if(findMsgDocument) {
								msg.channel.send("A role reaction set up exists for this message already...");
							} else {
								let dbMsgModel = new MessageModel({
									messageId: fetchedMessage.id,
									emojiRoleMappings: emojiRoleMappings
								});
								client.cachedMessageReactions.set(fetchedMessage.id, emojiRoleMappings);
								dbMsgModel.save()
									.catch(err => console.log(err));
							}
					});
				}
			} catch(err) {
				console.log(err);
				let message = await msg.channel.send("Invalid id. Message was not found.");
				await message.delete({ timeout: 3500 }).catch(err => console.log(err));
			}
		}
	}
}