import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
} from 'discord.js';
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
        const embed = new EmbedBuilder()
            .setTitle('Ticket Basic Config Editor')
            .setDescription(
                'This is the basic config editor for setup and changes.',
            );

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('addpanel')
                .setLabel('+ Add a panel')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('removepanel')
                .setLabel('🗑️ Remove a panel')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('editpanel')
                .setLabel('✏️ Edit a panel')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('sendpanels')
                .setLabel('✅ Send panels')
                .setStyle(ButtonStyle.Success),
        );
        await interaction.reply({
            embeds: [embed],
            components: [actionRow],
            ephemeral: true,
        });
    }
}
