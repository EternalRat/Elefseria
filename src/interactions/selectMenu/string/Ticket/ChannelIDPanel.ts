import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { SetupTicketSlashCommand } from '@src/interactions/slash/Ticket/Setup';
import { DiscordClient } from '@src/structures';
import { BaseSelectInteraction } from '@src/structures/base/BaseSelectInteraction.class';
import { EmbedBuilder, StringSelectMenuInteraction } from 'discord.js';

export class ChannelIdPanelInteraction extends BaseSelectInteraction {
    constructor() {
        super('removePanelIds', 'Remove selected panels', 'Ticket');
    }

    async execute(
        _client: DiscordClient,
        interaction: StringSelectMenuInteraction,
    ) {
        const ticketHandler = TicketHandler.getInstance();
        const val = interaction.values;
        const allPanels = await ticketHandler.getGuildTicketByGuildId(
            interaction.guildId!,
        );
        const panels = allPanels.filter((panel) =>
            val.includes((panel.get('id') as number).toString()),
        );
        const filteredPanels = allPanels.filter(
            (panel) => !panels.includes(panel),
        );
        for (const panel of panels) {
            await ticketHandler.deleteGuildTicket(panel.get('id') as string);
        }
        const activePanelNumber = filteredPanels.filter(
            (panel) => panel.get('status') === 1,
        ).length;
        const embed = new EmbedBuilder()
            .setTitle('Remove Panel')
            .setDescription(
                `Successfully removed ${
                    panels.length > 1 ? 'panels' : 'panel'
                }`,
            )
            .setColor('Red');

        const { embed: embeds, actionRow } =
            SetupTicketSlashCommand.getSetupComponents(
                activePanelNumber,
                filteredPanels,
            );

        await interaction.deferUpdate({
            fetchReply: true,
        });
        await interaction.editReply({
            content: '',
            embeds: [embed, embeds],
            components: [actionRow],
        });
    }
}
