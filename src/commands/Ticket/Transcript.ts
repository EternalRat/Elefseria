import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseCommand, DiscordClient } from '@src/structures';
import { Message, TextChannel } from 'discord.js';

/**
 * @description TicketCreate command
 * @class TicketCreate
 * @extends BaseCommand
 */
export class TicketTranscriptCommand extends BaseCommand {
    constructor() {
        super(
            'tickettranscript',
            ['tt'],
            'Ticket',
            'Create a transcript',
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
        ticketInstance
            .transcriptTicket(
                message.channel! as TextChannel,
                message.guild!,
                message.author,
            )
            .then(() => {
                message.reply({
                    content: 'Transcript created and sent to you !',
                });
            })
            .catch(() => {
                message.reply({
                    content:
                        'An error occured while creating the transcript, please try again later',
                });
            });
    }
}
