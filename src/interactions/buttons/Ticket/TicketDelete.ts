import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { ButtonInteraction } from 'discord.js';

/**
 * @description TicketDelete button interaction
 * @class TicketDeleteButtonInteraction
 * @extends BaseInteraction
 */
export class TicketDeleteButtonInteraction extends BaseButtonInteraction {
    constructor() {
        super('ticketdelete', 'Delete a ticket', 'Ticket', 0);
    }

    /**
     * @description Executes the interaction
     * @param {DiscordClient} client
     * @param {ButtonInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(
        _client: DiscordClient,
        _interaction: ButtonInteraction,
    ): Promise<void> {}
}
