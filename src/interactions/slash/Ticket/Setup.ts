import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from 'discord.js';
import { BaseSlashCommand, DiscordClient } from '@src/structures';
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    TextInputStyle,
} from 'discord.js';

export class SetupTicketSlashCommand extends BaseSlashCommand {
    constructor() {
        super(
            'setup',
            'Setup everything necessary to tickets',
            'Ticket',
            [],
            true,
            [
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageRoles,
                PermissionFlagsBits.ManageGuild,
            ],
        );
    }

    async execute(
        _client: DiscordClient,
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        const modal = new ModalBuilder().setCustomId('setup').setTitle('Setup');

        // Create the text input components
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favoriteColorInput')
            // The label is the prompt the user sees for this input
            .setLabel("What's your favorite color?")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const hobbiesInput = new TextInputBuilder()
            .setCustomId('hobbiesInput')
            .setLabel("What's some of your favorite hobbies?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                favoriteColorInput,
            );
        const secondActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                hobbiesInput,
            );

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    }
}
