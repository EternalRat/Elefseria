import { DiscordClient } from '@src/structures';
import { BaseButtonInteraction } from '@src/structures/base/BaseButtonInteraction.class';
import { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';

/**
 * @description TicketSave button interaction
 * @class TicketSaveButtonInteraction
 * @extends BaseInteraction
 */
export class TicketSaveButtonInteraction extends BaseButtonInteraction {
    constructor() {
        super('ticketsave', 'Save transcript of a ticket', 'Ticket', 0);
    }

    /**
     * @description Executes the interaction
     * @param {DiscordClient} client
     * @param {ButtonInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(
        client: DiscordClient,
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
                'This command can only be used in a channel',
            );
            return;
        }

        // Create Attachment
        /* const ticket = TicketManager.getInstance().getTicket(
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

        await interaction.reply({ files: [attachment] }); */
    }
}
