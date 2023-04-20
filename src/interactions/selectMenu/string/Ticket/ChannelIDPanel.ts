import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
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
        for (const panel of panels) {
            await ticketHandler.deleteGuildTicket(panel.get('id') as string);
        }
        const embed = new EmbedBuilder()
            .setTitle('Remove Panel')
            .setDescription(
                `Successfully removed ${
                    panels.length > 1 ? 'panels' : 'panel'
                }`,
            )
            .setColor('Red');

        await interaction.deferUpdate({
            fetchReply: true,
        });
        await interaction.editReply({
            embeds: [embed],
            components: [],
        });
    }
}
