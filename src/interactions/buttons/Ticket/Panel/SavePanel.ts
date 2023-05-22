import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { SetupTicketSlashCommand } from '@src/interactions/slash/Ticket/Setup';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { ButtonInteraction } from 'discord.js';

export class AddPanelButtonInteraction extends BaseButtonInteraction {
    constructor() {
        super('savePanel', 'Save a ticket panel', 'Ticket', 0);
    }

    async execute(_client: DiscordClient, interaction: ButtonInteraction) {
        const ticketHandler = TicketHandler.getInstance();
        const lastPanel = await ticketHandler.createIfLastPanelActive(
            interaction.guildId!,
            await ticketHandler.getLatestPanel(interaction.guild!.id),
        );
        await ticketHandler.updatePanel(lastPanel.get('id') as string, {
            status: 1,
        });
        const allPanels = await ticketHandler.getPanelsByGuildId(
            interaction.guildId!,
        );
        const activePanelNumber = allPanels.filter(
            (panel) => panel.get('status') === 1,
        ).length;

        await interaction.deferUpdate({
            fetchReply: true,
        });

        const { embed, actionRow } = SetupTicketSlashCommand.getSetupComponents(
            activePanelNumber,
            allPanels,
        );
        await interaction.editReply({
            content: '',
            embeds: [embed],
            components: [actionRow],
        });
    }
}
