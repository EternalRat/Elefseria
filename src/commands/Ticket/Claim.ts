import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import { Message } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketClaimCommand extends BaseCommand {
    constructor() {
        super(
            'ticketclaim',
            ['tac'],
            'Ticket',
            'Claim this ticket',
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
        const ticket = await ticketInstance.getTicketByChannelId(
            message.channelId,
        );
        if (
            await ticketInstance.isTicketClaimed(
                message.channel!,
                message.author,
            )
        ) {
            await message.reply({
                content: 'This ticket is already claimed',
            });
            return;
        }
        if (ticket!.get('owner') === message.author.id) {
            await message.reply({
                content: 'You already own this ticket',
            });
            return;
        }
        ticketInstance
            .updateTicketOwner(
                message.channel!,
                message.guild!,
                message.author.id,
            )
            .then(async () => {
                await message.reply({
                    content: `You have claimed this ticket`,
                });
            })
            .catch(async (err) => {
                await message.reply({
                    content: `An error occured while claiming this ticket: ${err}`,
                });
            });
    }
}
