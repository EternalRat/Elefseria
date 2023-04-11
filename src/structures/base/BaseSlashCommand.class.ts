import { SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { BaseInteraction } from '@src/structures';
export { DiscordClient } from '@class/Client.class';

/**
 * @description Base class for slash commands
 * @category BaseClass
 */
export abstract class BaseSlashCommand extends BaseInteraction {
    private slashCommand: SlashCommandBuilder | undefined;

    constructor(
        name: string,
        description: string,
        moduleName: string,
        options?: any,
        cooldown?: number,
        isEnabled?: boolean,
        permissions?: string[],
    ) {
        super(
            name,
            description,
            moduleName,
            options,
            cooldown,
            isEnabled,
            permissions,
        );
    }

    public set slashCommandInfo(slashCommand: SlashCommandBuilder) {
        this.slashCommand = slashCommand;
    }

    /**
     * @description Returns the SlashCommandBuilder of the command
     * @returns {SlashCommandBuilder}
     *
     */
    public getSlashCommand(): SlashCommandBuilder | undefined {
        return this.slashCommand;
    }
}
