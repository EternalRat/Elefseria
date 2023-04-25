import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { AddPanelButtonInteraction } from '@src/interactions/buttons/Ticket/Panel/AddPanel';
import { DiscordClient } from '@src/structures';
import { BaseSelectInteraction } from '@src/structures/base/BaseSelectInteraction.class';
import { RoleSelectMenuInteraction } from 'discord.js';

export class RoleTicketInteraction extends BaseSelectInteraction {
    constructor() {
        super('roleTicket', 'Select a role to send the ticket to', 'Ticket');
    }

    async execute(
        _client: DiscordClient,
        interaction: RoleSelectMenuInteraction,
    ) {
        const val = interaction.values;
        const title = interaction.message.embeds[0].title;
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
            { rolesId: val },
        );
        await interaction.editReply({
            content: '',
            embeds: [...replyComponent.embeds],
            components: [...replyComponent.components],
        });
    }
}
