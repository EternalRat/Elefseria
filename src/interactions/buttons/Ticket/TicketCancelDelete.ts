import { TicketManager } from '@src/class/ticket/ticketManager.class';
import { BaseInteraction, DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketCancelDelete button interaction
 * @class TicketCancelDeleteButtonInteraction
 * @extends BaseButtonInteraction
 */
export class TicketCancelDeleteButtonInteraction extends BaseInteraction {
    constructor() {
        super('ticketcanceldelete', 'Delete a ticket', 'Ticket');
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
        TicketManager.getInstance().cancelDeleteTicket(interaction.channelId);
        await interaction.reply('Ticket deletion cancelled');
        await interaction.deleteReply();
    }
}
