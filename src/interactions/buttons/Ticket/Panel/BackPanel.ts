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
        const lastPanel = await ticketHandler.createIfLastPanelActive(
            interaction.guildId!,
            await ticketHandler.getLastPanelCreated(interaction.guild!.id),
        );
        const title = interaction.message.embeds[0].title;
        const allPanels = await ticketHandler.getGuildTicketByGuildId(
            interaction.guildId!,
        );
        const activePanelNumber = allPanels.filter(
            (panel) => panel.get('status') === 1,
        ).length;
        const page =
            title && title.startsWith('Setup ')
                ? parseInt(
                      title.slice(
                          title.indexOf('Setup ') + 'Setup '.length,
                          title.indexOf('/'),
                      ),
                  ) - 2
                : 0;
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
                embeds: [embed],
                components: [actionRow],
            });
            return;
        }
        const replyComponent = await AddPanelButtonInteraction.buildReply(
            lastPanel,
            page,
        );
        await interaction.editReply({
            embeds: [...replyComponent.embeds],
            components: [...replyComponent.components],
        });
    }
}