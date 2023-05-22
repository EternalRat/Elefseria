import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { BaseSlashCommand, DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketOpen slash command
 * @class TicketOpen
 * @extends BaseSlashCommand
 */
export class TicketClaimSlashCommand extends BaseSlashCommand {
    constructor() {
        super('claim', 'Claim this ticket', 'Ticket');
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
        const ticket = await ticketInstance.getTicketByChannelId(
            interaction.channelId,
        );
        if (
            await ticketInstance.isTicketClaimed(
                interaction.channel!,
                interaction.user!,
            )
        ) {
            await interaction.reply({
                content: 'This ticket is already claimed',
                ephemeral: true,
            });
            return;
        }
        if (ticket!.get('owner') === interaction.user.id) {
            await interaction.reply({
                content: 'You already own this ticket',
                ephemeral: true,
            });
            return;
        }
        ticketInstance
            .updateTicketOwner(
                interaction.channel!,
                interaction.guild!,
                interaction.user.id,
            )
            .then(async () => {
                await interaction.reply({
                    content: `You have claimed this ticket`,
                    ephemeral: true,
                });
            })
            .catch(async (err) => {
                await interaction.reply({
                    content: `An error occured while claiming this ticket: ${err}`,
                    ephemeral: true,
                });
            });
    }
}
