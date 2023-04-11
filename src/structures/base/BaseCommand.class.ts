import { ChatInputCommandInteraction, Message } from 'discord.js';
import { DiscordClient } from '../../class/Client.class';

/**
 * @description Base class for commands
 * @category BaseClass
 */
export abstract class BaseCommand {
    private _name: string;
    private _aliases: string[];
    private _enabled: boolean;
    private _module: string = '';
    private _description: string;
    private _usage: string;
    private _cooldown: number;
    private _permissions: string[];

    constructor(
        name: string,
        aliases: string[],
        moduleName: string,
        description?: string,
        usage?: string,
        cooldown?: number,
        isEnabled?: boolean,
        permissions?: string[],
    ) {
        this._name = name;
        this._aliases = aliases;
        this._module = moduleName;
        this._enabled = isEnabled || true;
        this._description = description || '';
        this._usage = usage || '';
        this._cooldown = cooldown || 0;
        this._permissions = permissions || [];
    }

    /**
     * @description Returns the name of the command
     * @returns {string}
     * @example
     * // returns 'command'
     * command.getName();
     * @category Getter
     */
    public get name(): string {
        return this._name;
    }

    /**
     * @description Returns the aliases of the command
     * @returns {string[]}
     * @example
     * // returns ['alias1', 'alias2']
     * command.getAliases();
     * @category Getter
     */
    public get aliases(): string[] {
        return this._aliases;
    }

    /**
     * @description Returns the active status of the command
     * @returns {boolean}
     * @example
     * // returns true
     * command.isEnabled();
     * @category Getter
     */
    public get isEnabled(): boolean {
        return this._enabled;
    }

    /**
     * @description Returns the module of the command
     * @returns {string}
     * @example
     * // returns 'module'
     * command.getModule();
     * @category Getter
     */
    public get module(): string {
        return this._module;
    }

    /**
     * @description Returns the description of the command
     * @returns {string}
     * @example
     * // returns 'command'
     * command.getDescription();
     * @category Getter
     */
    public get description(): string {
        return this._description;
    }

    /**
     * @description Returns the usage of the command
     * @returns {string}
     * @example
     * // returns 'command'
     * command.getUsage();
     * @category Getter
     */
    public get usage(): string {
        return this._usage;
    }

    /**
     * @description Returns the cooldown of the command
     * @returns {number}
     * @example
     * // returns 5
     * command.getCooldown();
     * @category Getter
     */
    public get cooldown(): number {
        return this._cooldown;
    }

    /**
     * @description Returns the permissions of the command
     * @returns {string[]}
     * @example
     * // returns ['ADMINISTRATOR']
     * command.getPermissions();
     * @category Getter
     */
    public get permissions(): string[] {
        return this._permissions;
    }

    /**
     * @description Executes the command
     * @param {Message} message
     * @param {string[]} args
     * @example
     * // executes the command
     * command.execute(message, args);
     */
    async execute(
        client: DiscordClient,
        message: Message,
        args: string[],
    ): Promise<void> {
        throw new Error(
            `Command ${this._name} doesn't provide an execute method!`,
        );
    }

    async executeSlash(
        client: DiscordClient,
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        throw new Error(
            `Command ${this._name} doesn't provide an executeSlash method!`,
        );
    }
}
