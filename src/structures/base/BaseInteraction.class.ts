import { DiscordClient } from '@src/structures';
import { Interaction } from 'discord.js';

/**
 * @description Base class for slash commands
 * @category BaseClass
 */
export abstract class BaseInteraction {
    private _name: string;
    private _description: string;
    private _options: any;
    private _module: string;
    private _enabled: boolean;
    private _cooldown: number;
    private _permissions: string[];

    constructor(
        name: string,
        description: string,
        moduleName: string,
        options?: any,
        cooldown?: number,
        isEnabled?: boolean,
        permissions?: string[],
    ) {
        this._name = name;
        this._description = description;
        this._module = moduleName;
        this._options = options || [];
        this._enabled = isEnabled || true;
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

    public get options(): any {
        return this._options;
    }

    public get isEnable(): boolean {
        return this._enabled;
    }

    /**
     * @description Returns JSON data for the command
     * @returns {Object}
     */
    public getJSON(): Object {
        return {
            name: this._name,
            description: this._description,
            options: this._options,
        };
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
