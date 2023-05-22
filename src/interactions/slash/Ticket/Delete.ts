import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseSlashCommand, DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketOpen slash command
 * @class TicketOpen
 * @extends BaseSlashCommand
 */
export class TicketDeleteSlashCommand extends BaseSlashCommand {
    constructor() {
        super('delete', 'Delete this ticket', 'Ticket');
    }

    /**
     * @description Executes the slash command
     * @param {DiscordClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(
        _client: DiscordClient,
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        const ticketInstance = TicketHandler.getInstance();
        if (!interaction.guildId) {
            await interaction.reply({
                content: 'This command can only be used in a server',
                ephemeral: true,
            });
            return;
        }
        if (!interaction.channelId) {
            await interaction.reply({
                content:
                    'This command can only be used in a channel, if you are in a ticket, try again discord may have not updated the channel id yet',
                ephemeral: true,
            });
            return;
        }
        if (!(await ticketInstance.isTicket(interaction.channelId))) {
            await interaction.reply({
                content: 'This channel is not a ticket',
                ephemeral: true,
            });
            return;
        }
        if (!(await ticketInstance.isTicketClosed(interaction.channel!))) {
            await interaction.reply({
                content: "This ticket isn't closed. Close it first",
                ephemeral: true,
            });
            return;
        }
        await ticketInstance.deleteTicketByChannel(interaction.channel!);
    }
}
