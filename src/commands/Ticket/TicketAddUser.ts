import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import { Message } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketAddUserCommand extends BaseCommand {
    constructor() {
        super(
            'ticketadduser',
            ['tau'],
            'Ticket',
            'Add user to ticket',
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
        if (args.length == 0) {
            message.reply('Please specify a user');
            return;
        }
        const user =
            message.mentions.users.first() ||
            message.guild?.members.cache.get(args[0])?.user;
        if (!user) {
            message.reply('Please specify a valid user');
            return;
        }
        TicketHandler.getInstance().addUserToTicket(message.channel, [user]);
    }
}
