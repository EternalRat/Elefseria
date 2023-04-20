import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import {
    ActionRowBuilder,
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';

export class NamePanelInteraction extends BaseButtonInteraction {
    constructor() {
        super(
            'namePanel',
            'Open a modal for the name of the panel',
            'Ticket',
            0,
        );
    }

    async execute(
        _client: DiscordClient,
        interaction: ButtonInteraction,
    ): Promise<void> {
        const ticketHandler = TicketHandler.getInstance();
        const lastPanel = await ticketHandler.createIfLastPanelActive(
            interaction.guildId!,
            await ticketHandler.getLastPanelCreated(interaction.guild!.id),
        );
        const modals = new ModalBuilder();

        modals.setTitle(
            (lastPanel.get('name') as string).length > 0
                ? 'Change Panel Name'
                : 'Create Panel Name',
        );
        modals.setCustomId('createNamePanel');

        const textInput = new TextInputBuilder()
            .setLabel('Name')
            .setValue(
                (lastPanel.get('name') as string).length > 0
                    ? (lastPanel.get('name') as string)
                    : 'Panel Name',
            )
            .setMinLength(1)
            .setMaxLength(100)
            .setRequired(true)
            .setPlaceholder('Panel Name')
            .setCustomId('name')
            .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
            textInput,
        );

        modals.addComponents(row);

        interaction.showModal(modals);
        // TODO
    }
}
