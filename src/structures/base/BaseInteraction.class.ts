import { DiscordClient } from '@src/structures';
import { Interaction } from 'discord.js';

/**
 * @description Base class for slash commands
 * @category BaseClass
 */
export abstract class BaseInteraction {
    private _name: string;
    private _description: string;
    private _module: string;
    private _enabled: boolean;
    private _permissions: bigint[];

    constructor(
        name: string,
        description: string,
        moduleName: string,
        isEnabled: boolean = true,
        permissions: bigint[] = [],
    ) {
        this._name = name;
        this._description = description;
        this._module = moduleName;
        this._enabled = isEnabled;
        this._permissions = permissions;
    }

    /**
     * @description Returns the name of the command
     * @returns {string}
     * @example
     * // returns 'command'
     * command.name;
     * @category Getter
     */
    public get name(): string {
        return this._name;
    }

    /**
     * @description Returns the description of the command
     * @returns {string}
     * @example
     * // returns 'command'
     * command.description;
     * @category Getter
     */
    public get description(): string {
        return this._description;
    }

    /**
     * @description Returns the module of the command
     * @returns {string}
     * @example
     * // returns 'module'
     * command.module;
     * @category Getter
     */
    public get module(): string {
        return this._module;
    }
    /**
     * @description Returns the permissions of the command
     * @returns {string[]}
     * @example
     * // returns ['ADMINISTRATOR']
     * command.permissions;
     * @category Getter
     */
    public get permissions(): bigint[] {
        return this._permissions;
    }

    public get isEnable(): boolean {
        return this._enabled;
    }

    /**
     * @description Executes the command
     * @param {DiscordClient} client
     * @param {Interaction} interaction
     */
    public execute(
        _client: DiscordClient,
        _interaction: Interaction,
    ): Promise<void> {
        throw new Error(
            `Command ${this._name} doesn't have an execute method!`,
        );
    }
}
