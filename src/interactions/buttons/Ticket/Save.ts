import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { ButtonInteraction, TextChannel } from 'discord.js';

/**
 * @description TicketSave button interaction
 * @class TicketSaveButtonInteraction
 * @extends BaseInteraction
 */
export class TicketSaveButtonInteraction extends BaseButtonInteraction {
	constructor() {
		super('saveTicket', 'Save transcript of a ticket', 'Ticket', 0);
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
		await ticketHandler.transcriptTicket(
			interaction.channel as TextChannel,
			interaction.guild!,
			interaction.user,
		);
		await interaction.reply({
			content: 'Transcript saved and sent to you!',
			ephemeral: true,
		});
	}
}
