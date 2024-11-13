import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { SetupTicketSlashCommand } from '@src/interactions/slash/Ticket/Setup';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { ButtonInteraction } from 'discord.js';

import { AddPanelButtonInteraction } from './AddPanel';

export class BackPanelInteraction extends BaseButtonInteraction {
	constructor() {
		super('backPanel', 'Go back to the previous panel', 'Ticket', 0);
	}

	async execute(_client: DiscordClient, interaction: ButtonInteraction) {
		const ticketHandler = TicketHandler.getInstance();
		const title = interaction.message.embeds[0].title;
		const allPanels = await ticketHandler.getPanelsByGuildId(
			interaction.guildId!,
		);
		const activePanelNumber = allPanels.filter(
			(panel) => panel.get('status') === 1,
		).length;
		let page =
			title && title.startsWith('Setup ')
				? parseInt(
						title.slice(
							title.indexOf('Setup ') + 'Setup '.length,
							title.indexOf('/'),
						),
					) - 2
				: 0;
		if (title && (title.startsWith('Remove') || title.startsWith('Edit'))) {
			page = -1;
		}
		await interaction.deferUpdate({
			fetchReply: true,
		});

		if (page < 0) {
			const { embed, actionRow } =
				SetupTicketSlashCommand.getSetupComponents(
					activePanelNumber,
					allPanels,
				);
			await interaction.editReply({
				content: '',
				embeds: [embed],
				components: [actionRow],
			});
			return;
		}
		const lastPanel = await ticketHandler.createIfLastPanelActive(
			interaction.guildId!,
			await ticketHandler.getLatestPanel(interaction.guild!.id),
		);
		const replyComponent = await AddPanelButtonInteraction.buildReply(
			lastPanel,
			page,
		);
		await interaction.editReply({
			content: '',
			embeds: [...replyComponent.embeds],
			components: [...replyComponent.components],
		});
	}
}
