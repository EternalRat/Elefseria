import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { AddPanelButtonInteraction } from '@src/interactions/buttons/Ticket/Panel/AddPanel';
import { DiscordClient } from '@src/structures';
import { BaseSelectInteraction } from '@src/structures/base/BaseSelectInteraction.class';
import { ChannelSelectMenuInteraction } from 'discord.js';

export class ChannelTicketSelect extends BaseSelectInteraction {
    constructor() {
        super(
            'channelName',
            'Select a channel to send the ticket to',
            'Ticket',
        );
    }

    async execute(
        _client: DiscordClient,
        interaction: ChannelSelectMenuInteraction,
    ) {
        const val = interaction.values[0];
        const title = interaction.message.embeds[0].title;
        const isChannelTicket = title?.includes('Channel To Send');
        const isTranscriptTicket = title?.includes('Transcript Channel');
        const ticketHandler = TicketHandler.getInstance();
        const lastPanel = await ticketHandler.createIfLastPanelActive(
            interaction.guildId!,
            await ticketHandler.getLastPanelCreated(interaction.guild!.id),
        );
        let page =
            title && title.startsWith('Setup ')
                ? parseInt(
                      title.slice(
                          title.indexOf('Setup ') + 'Setup '.length,
                          title.indexOf('/'),
                      ),
                  ) - 1
                : 0;
        await interaction.deferUpdate({
            fetchReply: true,
        });

        const replyComponent = await AddPanelButtonInteraction.buildReply(
            lastPanel,
            page,
            isChannelTicket
                ? { channelId: val }
                : isTranscriptTicket
                ? { transcriptChannelId: val }
                : undefined,
        );
        await interaction.editReply({
            embeds: [...replyComponent.embeds],
            components: [...replyComponent.components],
        });
    }
}
