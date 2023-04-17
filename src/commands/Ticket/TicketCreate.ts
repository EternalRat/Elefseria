import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import { ChannelType, Message } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketCreateCommand extends BaseCommand {
    constructor() {
        super(
            'ticketcreate',
            ['tc'],
            'Ticket',
            'Create a ticket',
            'Tickets',
            0,
            true,
            [],
        );
    }

    /**
     * @description Executes the command
     * @param {DiscordClient} client
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<void>}
     */

    async execute(
        _client: DiscordClient,
        message: Message,
        _args: string[],
    ): Promise<void> {
        if (message.channel.type !== ChannelType.GuildText) {
            message.reply('This command can only be used in a server');
            return;
        }
        const { ticket, channel } =
            await TicketHandler.getInstance().createTicket(
                message.guild!,
                message.author,
                [],
            );
        if (ticket) {
            message.reply(
                `The ticket ${ticket.get('id')} has been created in ${channel}`,
            );
        } else {
            message.reply('An error occurred');
        }
    }
}
