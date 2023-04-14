import { TicketManager } from '@src/class/ticket/ticketManager.class';
import { BaseInteraction, DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketDelete button interaction
 * @class TicketDeleteButtonInteraction
 * @extends BaseInteraction
 */
export class TicketDeleteButtonInteraction extends BaseInteraction {
    constructor() {
        super('ticketdelete', 'Delete a ticket', 'Ticket');
    }

    /**
     * @description Executes the interaction
     * @param {DiscordClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(
        client: DiscordClient,
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        TicketManager.getInstance().deleteTicket(interaction, client);
    }
}
