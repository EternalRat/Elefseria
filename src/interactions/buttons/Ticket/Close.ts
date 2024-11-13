import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';

/**
 * @description TicketClose button interaction
 * @class TicketCloseButtonInteraction
 * @extends BaseButtonInteraction
 */
export class TicketCloseButtonInteraction extends BaseButtonInteraction {
	constructor() {
		super('closeTicket', 'Close a ticket', 'Ticket', 0);
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
		const ticketHandler = TicketHandler.getInstance();
		if (!interaction.channel) {
			await interaction.reply(
				'This command can only be used in a channel',
			);
			return;
		}
		if (!(await ticketHandler.isTicket(interaction.channelId))) {
			await interaction.reply(
				'This command can only be used in a ticket',
			);
			return;
		}
		if (await ticketHandler.isTicketClosed(interaction.channel)) {
			await interaction.reply('Ticket is already closed');
			return;
		}
		await ticketHandler.closeTicket(interaction.channel);
		const embed = new EmbedBuilder()
			.setTitle('Ticket Interaction')
			.setDescription('Ticket closed by <@' + interaction.user.id + '>')
			.setColor('Red')
			.setTimestamp();
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setCustomId('deleteTicket')
				.setLabel('Delete ticket')
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId('openTicket')
				.setLabel('Open ticket')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('saveTicket')
				.setLabel('Save ticket')
				.setStyle(ButtonStyle.Secondary),
		]);
		await interaction.reply({
			content: '',
			embeds: [embed],
			components: [row],
		});
	}
}
