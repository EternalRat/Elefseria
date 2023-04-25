import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { AddPanelButtonInteraction } from '@src/interactions/buttons/Ticket/Panel/AddPanel';
import { SetupTicketSlashCommand } from '@src/interactions/slash/Ticket/Setup';
import { DiscordClient } from '@src/structures';
import { BaseSelectInteraction } from '@src/structures/base/BaseSelectInteraction.class';
import { EmbedBuilder, StringSelectMenuInteraction } from 'discord.js';

export class ChannelIdPanelInteraction extends BaseSelectInteraction {
    constructor() {
        super('editPanelId', 'Edit selected panel', 'Ticket');
    }

    async execute(
        _client: DiscordClient,
        interaction: StringSelectMenuInteraction,
    ) {
        const ticketHandler = TicketHandler.getInstance();
        const val = interaction.values[0];
        const allPanels = await ticketHandler.getGuildTicketByGuildId(
            interaction.guildId!,
        );

        await allPanels
            .find((g) => {
                const { id } = g.get();
                return id.toString() === val;
            })!
            .set('status', 2)
            .save();

        const { embeds, components } =
            await AddPanelButtonInteraction.buildReply(
                allPanels.find((g) => {
                    const { id } = g.get();
                    return id.toString() === val;
                })!,
                0,
            );

        await interaction.deferUpdate({
            fetchReply: true,
        });
        await interaction.editReply({
            content: '',
            embeds: [...embeds],
            components: [...components],
        });
    }
}
