const PermissionGuard = require('../../utils/PermissionGuard');
const BaseCommand = require('../../utils/structures/BaseCommand');
const { rerollGiveaways } = require("../../utils/giveaway")

module.exports = class RerollCommand extends BaseCommand {
	constructor() {
		super('reroll', 'giveaway', [], 3, true, "Reroll a giveaway", "<messageId>", new PermissionGuard(["MANAGE_MESSAGES"]));
	}

	run(client, msg, args) {
		if (!args.length) return;
		reroll_giveaway(client, args, msg);
	}
}

async function reroll_giveaway(client, args, message) {
	if (args.length !== 1) return message.channel.send("Enter a messageId please");
	await rerollGiveaways(args[0], message);
}