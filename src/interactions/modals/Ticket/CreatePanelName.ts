import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { AddPanelButtonInteraction } from '@src/interactions/buttons/Ticket/Panel/AddPanel';
import { DiscordClient } from '@src/structures';
import { BaseModalInteraction } from '@src/structures/base/BaseModalInteraction.class';
import { ModalSubmitInteraction } from 'discord.js';

export class CreatePanelModalInteraction extends BaseModalInteraction {
    constructor() {
        super('createNamePanel', 'Create a panel', 'Ticket');
    }

    async execute(
        _client: DiscordClient,
        interaction: ModalSubmitInteraction,
    ): Promise<void> {
        const name = interaction.fields.getTextInputValue('name');
        const ticketHandler = TicketHandler.getInstance();
        const lastPanel = await ticketHandler.createIfLastPanelActive(
            interaction.guildId!,
            await ticketHandler.getLastPanelCreated(interaction.guild!.id),
        );
        const title = interaction.message!.embeds[0].title;
        const page =
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
            { name },
        );
        await interaction.editReply({
            content: '',
            embeds: [...replyComponent.embeds],
            components: [...replyComponent.components],
        });
    }
}
