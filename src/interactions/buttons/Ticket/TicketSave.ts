import { TicketManager } from '@src/class/ticket/ticketManager.class';
import { BaseInteraction, DiscordClient } from '@src/structures';
import { AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketSave button interaction
 * @class TicketSaveButtonInteraction
 * @extends BaseInteraction
 */
export class TicketSaveButtonInteraction extends BaseInteraction {
    constructor() {
        super('ticketsave', 'Save transcript of a ticket', 'Ticket');
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
                'This command can only be used in a channel',
            );
            return;
        }

        // Create Attachment
        const ticket = TicketManager.getInstance().getTicket(
            interaction.channelId,
        );
        if (!ticket) {
            await interaction.reply(
                'This command can only be used in a ticket',
            );
            return;
        }
        const transcript = await ticket.buildTranscript(
            interaction.guildId!,
            client,
        );
        if (!transcript) {
            await interaction.reply(
                'An error occurred while building the transcript',
            );
            return;
        }
        const bufferResolvable = Buffer.from(transcript);
        const attachment = new AttachmentBuilder(bufferResolvable, {
            name: 'transcript.html',
        });

        await interaction.reply({ files: [attachment] });
    }
}
