import { BaseSlashCommand, DiscordClient } from '@src/structures';
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandUserOption,
} from 'discord.js';

/**
 * @description Pong slash command
 * @class Pong
 * @extends BaseSlashCommand
 */
export class PongSlashCommand extends BaseSlashCommand {
    constructor() {
        super('pong', 'Ping! Pong!', 'Ticket', null, 0, true, []);
        super.slashCommandInfo = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption((option) =>
                option
                    .setName('category')
                    .setDescription('The gif category')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Funny', value: 'gif_funny' },
                        { name: 'Meme', value: 'gif_meme' },
                        { name: 'Movie', value: 'gif_movie' },
                    ),
            )
            .setDefaultMemberPermissions(null)
            .setDMPermission(false)
            .setDescriptionLocalization('fr', 'Ping! Pong!')
            .setNameLocalization('fr', 'pong')
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
