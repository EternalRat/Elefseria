import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
	ActionRowBuilder,
	ButtonInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';

export class MessagePanelInteraction extends BaseButtonInteraction {
	constructor() {
		super(
			'messagePanel',
			'Open a modal for the message of the panel',
			'Ticket',
			0,
		);
	}

	async execute(
		_client: DiscordClient,
		interaction: ButtonInteraction,
	): Promise<void> {
		const ticketHandler = TicketHandler.getInstance();
		const lastPanel = await ticketHandler.createIfLastPanelActive(
			interaction.guildId!,
			await ticketHandler.getLatestPanel(interaction.guild!.id),
		);
		const modals = new ModalBuilder();

		modals.setTitle(
			(lastPanel.get('message') as string).length > 0
				? 'Change Panel Message'
				: 'Create Panel Message',
		);
		modals.setCustomId('createMessagePanel');

		const textInput = new TextInputBuilder()
			.setLabel('Message')
			.setValue(
				(lastPanel.get('message') as string).length > 0
					? (lastPanel.get('message') as string)
					: 'Panel Message',
			)
			.setMinLength(1)
			.setMaxLength(100)
			.setRequired(true)
			.setPlaceholder('Panel Message')
			.setCustomId('message')
			.setStyle(TextInputStyle.Short);

		const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
			textInput,
		);

		modals.addComponents(row);

		interaction.showModal(modals);
		// TODO
	}
}
