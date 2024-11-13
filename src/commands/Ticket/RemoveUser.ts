import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import { Message } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketRemoveUserCommand extends BaseCommand {
	constructor() {
		super(
			'ticketremoveuser',
			['tru'],
			'Ticket',
			'Remove user from ticket',
			'Tickets',
			0,
			true,
			[],
		);
	}

	/**
	 * @description Executes the command
	 * @param {DiscordClient} _client
	 * @param {Message} message
	 * @param {string[]} args
	 * @returns {Promise<void>}
	 */
	async execute(
		_client: DiscordClient,
		message: Message,
		args: string[],
	): Promise<void> {
		if (args.length == 0) {
			message.reply('Please specify a user');
			return;
		}
		const user =
			message.mentions.users.first() ||
			message.guild?.members.cache.get(args[0])?.user;
		if (!user) {
			message.reply('Please specify a valid user');
			return;
		}
		TicketHandler.getInstance().removeUserFromTicket(message.channel, [
			user,
		]);
	}
}
