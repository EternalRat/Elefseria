import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from 'discord.js';

export class RemovePanelInteraction extends BaseButtonInteraction {
	constructor() {
		super('removePanel', 'Remove a ticket panel', 'Ticket', 0);
	}

	async execute(_client: DiscordClient, interaction: ButtonInteraction) {
		const ticketHandler = TicketHandler.getInstance();
		const allPanels = await ticketHandler.getPanelsByGuildId(
			interaction.guildId!,
		);
		const stringOptionInput = new StringSelectMenuBuilder()
			.setCustomId('removePanelIds')
			.setMinValues(allPanels.length > 0 ? 1 : 0)
			.setMaxValues(allPanels.length)
			.addOptions(
				allPanels.map((panel) => {
					return new StringSelectMenuOptionBuilder()
						.setLabel(
							(panel.get('name') as string).length > 0
								? (panel.get('name') as string)
								: 'Unknown name',
						)
						.setValue((panel.get('id') as number).toString())
						.setDescription(
							`Panel ID: ${
								panel.get('id') as string
							}\nIs Active: ${
								panel.get('status') === 1 ? 'Yes' : 'No'
							}`,
						);
				}),
			);
		const btn = new ButtonBuilder()
			.setCustomId('backPanel')
			.setLabel('Go back to Setup Panel')
			.setStyle(ButtonStyle.Success);
		const row =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				stringOptionInput,
			);
		const btnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(btn);
		const embed = new EmbedBuilder()
			.setTitle('Remove Panel')
			.setDescription(
				'Select the panels you want to remove. You can select multiple panels at once.',
			)
			.setColor('Red');
		const noPanels = new EmbedBuilder().setDescription(
			"There's no panel to remove",
		);
		await interaction.deferUpdate({
			fetchReply: true,
		});
		await interaction.editReply({
			content: '',
			embeds: allPanels.length > 0 ? [embed] : [embed, noPanels],
			components: allPanels.length > 0 ? [row, btnRow] : [btnRow],
		});
	}
}
