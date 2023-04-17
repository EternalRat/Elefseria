import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseSlashCommand, DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';
import { Model } from 'sequelize';

/**
 * @description TicketOpen slash command
 * @class TicketOpen
 * @extends BaseSlashCommand
 */
export class TicketCloseSlashCommand extends BaseSlashCommand {
    constructor() {
        super('close', "Close the current ticket you're in.", 'Ticket');
    }

    /**
     * @description Executes the slash command
     * @param {DiscordClient} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(
        client: DiscordClient,
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
        const ticket = (await ticketInstance.getTicketByChannelId(
            interaction.channelId,
        )) as Model<any, any>;
        if (
            ticket.get('ownerId') !== interaction.user.id ||
            ticket.get('creatorId') !== interaction.user.id
        ) {
            await interaction.reply({
                content: "You don't own this ticket",
                ephemeral: true,
            });
            return;
        }
        await ticketInstance.closeTicket(interaction.channel!);
    }
}
