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
        client: DiscordClient,
        message: Message,
        _args: string[],
    ): Promise<void> {
        await TicketManager.getInstance().createTicket(message, client);

        if (message.guild)
            console.info(
                TicketManager.getInstance().getTicket(message.guild.id),
            );
    }
}
