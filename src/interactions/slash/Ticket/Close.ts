import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseSlashCommand, DiscordClient } from '@src/structures';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
} from 'discord.js';

/**
 * @description TicketOpen slash command
 * @class TicketOpen
 * @extends BaseSlashCommand
 */
export class TicketCloseSlashCommand extends BaseSlashCommand {
    constructor() {
        super('close', "Close the current ticket you're in.", 'Ticket');
    }

    /**
     * @description Executes the slash command
     * @param {DiscordClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(
        client: DiscordClient,
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        const ticketInstance = TicketHandler.getInstance();
        if (!interaction.guildId) {
            await interaction.reply({
                content: 'This command can only be used in a server',
                ephemeral: true,
            });
            return;
        }
        if (!interaction.channelId) {
            await interaction.reply({
                content:
                    'This command can only be used in a channel, if you are in a ticket, try again discord may have not updated the channel id yet',
                ephemeral: true,
            });
            return;
        }
        if (!(await ticketInstance.isTicket(interaction.channelId))) {
            await interaction.reply({
                content: 'This channel is not a ticket',
                ephemeral: true,
            });
            return;
        }
        await ticketInstance.closeTicket(interaction.channel!);
        const embed = new EmbedBuilder()
            .setTitle('Ticket Interaction')
            .setDescription('Ticket closed by <@' + interaction.user.id + '>')
            .setColor('Red')
            .setTimestamp();
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setCustomId('deleteTicket')
                .setLabel('Delete ticket')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('openTicket')
                .setLabel('Open ticket')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('saveTicket')
                .setLabel('Save ticket')
                .setStyle(ButtonStyle.Secondary),
        ]);
        await interaction.reply({
            content: '',
            embeds: [embed],
            components: [row],
        });
    }
}
