import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { ButtonInteraction } from 'discord.js';

/**
 * @description TicketOpen button interaction
 * @class TicketOpenButtonInteraction
 * @extends BaseInteraction
 */
export class TicketOpenButtonInteraction extends BaseButtonInteraction {
	constructor() {
		super('openTicket', 'Open a ticket', 'Ticket', 0);
	}

	/**
	 * @description Executes the interaction
	 * @param {DiscordClient} client
	 * @param {ButtonInteraction} interaction
	 * @returns {Promise<void>}
	 */
	async execute(
		_client: DiscordClient,
		interaction: ButtonInteraction,
	): Promise<void> {
		if (!interaction.guildId) {
			await interaction.reply(
				'This command can only be used in a server',
			);
			return;
		}
		if (!interaction.channelId) {
			await interaction.reply(
				'This command can only be used in a channel',
			);
			return;
		}
		const ticketHandler = TicketHandler.getInstance();
		if (!(await ticketHandler.isTicket(interaction.channelId))) {
			await interaction.reply(
				'This command can only be used in a ticket',
			);
			return;
		}
		await ticketHandler.reopenTicket(interaction.channel!);
		await interaction.reply({
			content: 'Ticket has been reopened',
			ephemeral: true,
		});
	}
}
