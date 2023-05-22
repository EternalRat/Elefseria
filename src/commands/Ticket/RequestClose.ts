import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Message,
} from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketRequestCloseCommand extends BaseCommand {
    constructor() {
        super(
            'ticketrequestclose',
            ['tacl'],
            'Ticket',
            'Send a request to close this ticket',
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
        client: DiscordClient,
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
        const ticket = await ticketInstance.getTicketByChannelId(
            message.channelId,
        );
        if (!ticket) {
            await message.reply({
                content: 'This ticket does not exist',
            });
            return;
        }
        if (ticket.get('status') === 0) {
            await message.reply({
                content: 'This ticket is already closed',
            });
            return;
        }
        const ticketChannel = await message.guild!.channels.fetch(
            ticket.get('channelId') as string,
        );
        if (!ticketChannel) {
            await message.reply({
                content: 'This ticket does not exist',
            });
            return;
        }
        const rowBtns = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
                .setCustomId('ticket_close')
                .setLabel('Close')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('ticket_cancel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger),
        );
        await message.reply({
            content: 'Are you sure you want to close this ticket?',
            components: [rowBtns],
        });
    }
}
