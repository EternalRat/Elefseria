import { TicketManager } from '@src/class/ticket/ticketManager.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import { Message } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketCreateCommand extends BaseCommand {
    constructor() {
        super(
            'ticketset',
            ['ts'],
            'Ticket',
            'Set a channel as ticket',
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
        client: DiscordClient,
        message: Message,
        args: string[],
    ): Promise<void> {
        TicketManager.getInstance().setNewTicketFromMessage(message);
        console.info(TicketManager.getInstance().getTicket(message.channel.id));
    }
}
