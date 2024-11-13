import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import { Message } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketDeleteCommand extends BaseCommand {
	constructor() {
		super(
			'ticketdelete',
			['tad'],
			'Ticket',
			'Delete this ticket',
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
		_args: string[],
	): Promise<void> {
		const ticketInstance = TicketHandler.getInstance();
		if (!(await ticketInstance.isTicket(message.channelId))) {
			await message.reply({
				content: 'This channel is not a ticket',
			});
			return;
		}
		if (!(await ticketInstance.isTicketClosed(message.channel!))) {
			await message.reply({
				content: "This ticket isn't closed. Close it first",
			});
			return;
		}
		await ticketInstance.deleteTicketByChannel(message.channel!);
	}
}
