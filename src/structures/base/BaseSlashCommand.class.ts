import { BaseInteraction } from '@src/structures';
import {
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    SlashCommandBuilder,
} from 'discord.js';
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
    public getSlashCommandJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
        if (!this.slashCommand) {
            throw new Error(
                `Slash command ${this.name} does not have a SlashCommandBuilder`,
            );
        }
        return this.slashCommand.toJSON();
    }
}
