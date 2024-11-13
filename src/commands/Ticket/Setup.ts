import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { SetupTicketSlashCommand } from '@src/interactions/slash/Ticket/Setup';
import { BaseCommand, DiscordClient } from '@src/structures';
import { Message } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketClaimCommand extends BaseCommand {
	constructor() {
		super(
			'ticketsetup',
			['ts'],
			'Ticket',
			'Send the configuration panels for ticket',
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
		const ticketHandler = TicketHandler.getInstance();
		const allPanels = await ticketHandler.getPanelsByGuildId(
			message.guildId!,
		);
		const activePanelNumber = allPanels.filter(
			(panel) => panel.get('status') === 1,
		).length;
		const { embed, actionRow } = SetupTicketSlashCommand.getSetupComponents(
			activePanelNumber,
			allPanels,
		);
		await message.reply({
			embeds: [embed],
			components: [actionRow],
		});
	}
}
