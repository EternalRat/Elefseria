import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Message,
} from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketCloseCommand extends BaseCommand {
    constructor() {
        super(
            'ticketclose',
            ['tacl'],
            'Ticket',
            'Close this ticket',
            'Tickets',
            0,
            true,
            [],
        );
    }

    /**
     * @description Executes the command
     * @param {DiscordClient} _client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */
    async execute(
        _client: DiscordClient,
        message: Message,
        _args: string[],
    ): Promise<void> {
        const ticketInstance = TicketHandler.getInstance();
        if (!(await ticketInstance.isTicket(message.channelId))) {
            await message.reply({
                content: 'This channel is not a ticket',
            });
            return;
        }
        if (!(await ticketInstance.isTicket(message.channelId))) {
            await message.reply({
                content: 'This channel is not a ticket',
            });
            return;
        }
        await ticketInstance.closeTicket(message.channel!);
        const embed = new EmbedBuilder()
            .setTitle('Ticket Interaction')
            .setDescription('Ticket closed by <@' + message.author.id + '>')
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
        await message.reply({
            content: '',
            embeds: [embed],
            components: [row],
        });
    }
}
