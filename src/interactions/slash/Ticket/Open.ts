import { BaseSlashCommand, DiscordClient } from '@src/structures';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

/**
 * @description TicketOpen slash command
 * @class TicketOpen
 * @extends BaseSlashCommand
 */
export class TicketOpenSlashCommand extends BaseSlashCommand {
    constructor() {
        super(
            'open',
            "Open the current ticket you're in.",
            'Ticket',
            null,
            0,
            true,
            [],
        );
        super.slashCommandInfo = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(null)
            .setDMPermission(false)
            .setNSFW(false);
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
        await interaction.reply('Ping!');
    }
}
