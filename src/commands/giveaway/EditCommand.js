const BaseCommand = require('../../utils/structures/BaseCommand');
const { editGiveaways } = require("../../utils/giveaway");
const PermissionGuard = require('../../utils/PermissionGuard');

const prompts = [
	"What are you giving ?",
	"How long do you want the giveaway to last?",
	"How many winners?"
]

module.exports = class EditCommand extends BaseCommand {
	constructor() {
		super('edit', 'giveaway', ["editgiveaway"], 3, true, "edit a giveaway", "<messageId>", new PermissionGuard(["MANAGE_CHANNELS"]));
	}

	run(client, msg, args) {
		if (!args.length) return;
		edit_giveaway(client, args, msg);
	}
}

async function edit_giveaway(client, args, message) {
	if (args.length !== 1) return message.channel.send("Enter a messageId please");
	const response = await getResponses(message);
	await editGiveaways(args[0], response, message, client);
}

async function getResponses(message) {
	const validTime = /^\d+(s|m|h|d|S|M|H|D)$/;
	const validNumber = /^\d+/;
	const responses = { };

	for (let i = 0; i < prompts.length; i++) {
			await message.channel.send(prompts[i]);
			const filter = (m) => m.author.id === message.author.id;
			const response = await message.channel.awaitMessages({ filter, max: 1, time: 30_000, errors: ['time'] });
			const { content } = response.first();
			if (i === 0)
					responses.prize = content;
			if (i === 1)
					if (validTime.test(content))
							responses.duration = content;
					else
							throw new Error("Invalid format output")
			if (i === 2)
					if (validNumber.test(content))
							responses.winners = content;
					else
							throw new Error("Invalid entry for winners")
	}
	return responses;
}