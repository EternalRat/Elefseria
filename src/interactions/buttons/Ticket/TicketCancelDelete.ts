import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { ButtonInteraction } from 'discord.js';

/**
 * @description TicketCancelDelete button interaction
 * @class TicketCancelDeleteButtonInteraction
 * @extends BaseButtonInteraction
 */
export class TicketCancelDeleteButtonInteraction extends BaseButtonInteraction {
    constructor() {
        super('ticketcanceldelete', 'Delete a ticket', 'Ticket', 0);
    }

    /**
     * @description Executes the interaction
     * @param {DiscordClient} client
     * @param {ButtonInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(
        _client: DiscordClient,
        interaction: ButtonInteraction,
    ): Promise<void> {
        if (!interaction.guildId) {
            await interaction.reply(
                'This command can only be used in a server',
            );
            return;
        }
        if (!interaction.channelId) {
            await interaction.reply(
                'This command can only be used in a channel, if you are in a ticket, try again discord may have not updated the channel id yet',
            );
            return;
        }
    }
}
