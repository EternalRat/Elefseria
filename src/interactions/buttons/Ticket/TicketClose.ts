import { TicketManager } from '@src/class/ticket/ticketManager.class';
import { BaseInteraction, DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketClose button interaction
 * @class TicketCloseButtonInteraction
 * @extends BaseButtonInteraction
 */
export class TicketCloseButtonInteraction extends BaseInteraction {
    constructor() {
        super('ticketclose', 'Close a ticket', 'Ticket');
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
        const ticket = TicketManager.getInstance().getTicket(
            interaction.channelId,
        );
        if (ticket) await ticket.closeTicket(interaction, client);
        else interaction.reply('Ticket not found');
    }
}
