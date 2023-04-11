import {
    BaseCommand,
    BaseInteraction,
    DiscordClient,
    BaseSlashCommand,
} from '@src/structures';
import { Routes } from 'discord.js';
import fs from 'fs';

/**
 * @description Base class for modules
 * @category BaseClass
 */
export abstract class BaseModule {
    private name: string;
    private slashCommands: Map<string, BaseSlashCommand> = new Map();
    private interactions: Map<string, BaseInteraction> = new Map();
    private aliases: Map<string, BaseCommand> = new Map();
    private enabled: boolean;
    // May need to change this to a Collection<string, BaseCommand> if we want to add more properties to the commands same goes the aliases
    // private commands: Collection<string, BaseCommand> = new Collection();
    private commands: Map<string, BaseCommand> = new Map();

    /**
     * @description Creates a new module
     * @param name
     * @param isEnabled
     */
    constructor(name: string, isEnabled?: boolean) {
        this.name = name;
        this.enabled = isEnabled || true;
    }

    /**
     * @description Return interactions of the module
     * @returns {Map<string, BaseInteraction>}
     * @example
     * // returns Map(1) { 'ping' => [Function: Ping] }
     * module.getInteractions();
     */
    public getInteractions(): Map<string, BaseInteraction> {
        return this.interactions;
    }

    public getSlashCommands(): Map<string, BaseInteraction> {
        return this.slashCommands;
    }

    /**
     * @description Returns the name of the module
     * @returns {string}
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @description Returns the active status of the module
     * @returns {boolean}
     * @example
     * // returns true
     * module.isEnabled();
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * @description Sets the isEnabled status of the module
     * @param {boolean} isEnabled
     * @example
     * // sets the isEnabled status to false
     * module.setActive(false);
     */
    public setisEnabled(isEnabled: boolean): void {
        this.enabled = isEnabled;
    }

    /**
     * @description Returns the commands of the module
     * @returns {Map<string, BaseCommand>}
     * @example
     * // returns Map(1) { 'ping' => [Function: Ping] }
     * module.getCommands();
     */
    public getCommands(): Map<string, BaseCommand> {
        return this.commands;
    }

    /**
     * @description Checks if the module has a command
     * @param {string} name
     * @returns {boolean}
     * @example
     * // returns true
     * module.hasCommand('ping');
     */
    public hasCommand(name: string): boolean {
        return this.commands.has(name) || this.aliases.has(name);
    }

    /**
     * @description Returns a command from the module
     * @param {string} name
     * @returns {BaseCommand | undefined}
     * @example
     * // returns [Function: Ping]
     * module.getCommand('ping');
     */
    public getCommand(name: string): BaseCommand | undefined {
        if (this.commands.has(name)) return this.commands.get(name);
        if (this.aliases.has(name)) return this.aliases.get(name);
        return undefined;
    }

    /**
     * @description Loads commands into the module
     * @param {string} path
     * @example
     * // loads commands from src\commands\ping
     * module.loadCommands('src/commands/ping');
     * @example
     */
    async loadCommands(path: string) {
        if (!fs.existsSync(path)) return;
        let commandFiles = await fs.promises.readdir(path);
        for (const file of commandFiles) {
            const lstat = await fs.promises.lstat(`${path}/${file}`);
            if (lstat.isDirectory()) {
                this.loadCommands(`${path}/${file}`);
                continue;
            }
            const Command = await require(`${path}/${file}`);
            for (const kVal in Object.keys(Command)) {
                const value = Object.values(Command)[kVal];
                try {
                    const command = new (value as any)();
                    if (command.module !== this.name) continue;
                    this.commands.set(command.name, command);
                    if (!command.aliases) continue;
                    for (const alias of command.aliases) {
                        this.aliases.set(alias, command);
                    }
                } catch (error) {
                    console.error(error);
                    console.error(`Could not load command ${path}/${file}`);
                }
            }
        }
    }

    /**
     * @description Loads slash commands into the module
     * @param {string} path
     * @param path
     */
    async loadSlashCommands(path: string): Promise<void> {
        if (!fs.existsSync(path)) return;
        let commandFiles = await fs.promises.readdir(path);
        for (const file of commandFiles) {
            const lstat = await fs.promises.lstat(`${path}/${file}`);
            if (lstat.isDirectory()) {
                await this.loadSlashCommands(`${path}/${file}`);
                continue;
            }
            const Interaction = await import(`${path}/${file}`);
            for (const kVal in Object.keys(Interaction)) {
                const value = Object.values(Interaction)[kVal];
                try {
                    const interaction = new (value as any)();
                    if (interaction.module !== this.name) continue;
                    this.slashCommands.set(interaction.name, interaction);
                } catch (error) {
                    console.error(
                        `No slash command to load at ${path}/${file}`,
                    );
                }
            }
        }
    }

    async loadInteractions(path: string): Promise<void> {
        if (!fs.existsSync(path)) return;
        let commandFiles = await fs.promises.readdir(path);
        for (const file of commandFiles) {
            const lstat = await fs.promises.lstat(`${path}/${file}`);
            if (lstat.isDirectory()) {
                await this.loadSlashCommands(`${path}/${file}`);
                continue;
            }
            const Interaction = await import(`${path}/${file}`);
            for (const kVal in Object.keys(Interaction)) {
                const value = Object.values(Interaction)[kVal];
                try {
                    const interaction = new (value as any)();
                    if (interaction.module !== this.name) continue;
                    this.interactions.set(interaction.name, interaction);
                } catch (error) {
                    console.error(error);
                    console.error(`Could not load interaction ${path}/${file}`);
                }
            }
        }
    }

    /**
     * @description Registers slash commands
     * @param {DiscordClient} client Discord Client
     * @param {string?} guildId Guild ID
     * @example
     * // registers slash commands globally
     * module.registerSlashCommands(client);
     * @example
     * // registers slash commands in a guild
     * module.registerSlashCommands(client, '123456789');
     */
    public async registerSlashCommands(
        client: DiscordClient,
        alreadyAdded: Array<any>,
        guildId?: string,
    ): Promise<void> {
        console.info(
            'Registering slash commands should be done using a script now. See the DiscordJS documentation for further details.',
        );
        const commands = Array.from(this.slashCommands.values());
        const commandsToRegister = commands.filter((command) => {
            const slashedCommand = command.getSlashCommandJSON();
            console.log({ slashedCommand }, { alreadyAdded });
            if (
                alreadyAdded.find(
                    (addedCommand) => slashedCommand.name === addedCommand.name,
                )
            ) {
                return false;
            }
            return true;
        });
        const commandsToRefresh = commands.filter((command) => {
            if (
                !alreadyAdded.find((registeredCommand) => {
                    const slashedCommand = command.getSlashCommandJSON();
                    const differentName =
                        slashedCommand.name === registeredCommand.name;
                    const differentDescription =
                        slashedCommand.description ===
                        registeredCommand.description;
                    const differentOptions =
                        JSON.stringify(slashedCommand.options) ===
                        JSON.stringify(registeredCommand.options);
                    const differentNSFW =
                        slashedCommand.nsfw === registeredCommand.nsfw;
                    const differentPerm =
                        slashedCommand.default_member_permissions ===
                        registeredCommand.default_member_permissions;
                    console.log({ slashedCommand }, { registeredCommand });
                    return (
                        differentName &&
                        differentDescription &&
                        differentOptions &&
                        differentNSFW &&
                        differentPerm
                    );
                })
            )
                return true;
            return false;
        });

        console.info(
            `Started added ${commandsToRegister.length} application (/) commands.`,
        );
        // The put method is used to fully refresh all commands in the guild with the current set
        const addedData = (await client.rest.put(
            guildId
                ? Routes.applicationGuildCommands(client.getClientId(), guildId)
                : Routes.applicationCommands(client.getClientId()),
            {
                body: commandsToRegister.map((commandToRegister) =>
                    commandToRegister.getSlashCommandJSON(),
                ),
            },
        )) as Array<any>;

        console.info(
            `Successfully added ${addedData.length} application (/) commands.`,
        );

        console.info(
            `Started refreshing ${commandsToRefresh.length} application (/) commands.`,
        );

        const refreshData = [];
        for (const command of commandsToRefresh) {
            const registeredCommand = alreadyAdded.find(
                (registeredCommand) => registeredCommand.name === command.name,
            );
            if (registeredCommand) {
                const commandId = registeredCommand.id;
                const updatedData = (await client.rest.patch(
                    guildId
                        ? Routes.applicationGuildCommand(
                              client.getClientId(),
                              guildId,
                              commandId,
                          )
                        : Routes.applicationCommand(
                              client.getClientId(),
                              commandId,
                          ),
                    {
                        body: {
                            ...command.getSlashCommandJSON(),
                            id: commandId,
                        },
                    },
                )) as Array<any>;
                refreshData.push(updatedData);
            }
        }

        console.info(
            `Successfully refreshed ${refreshData.length} application (/) commands.`,
        );
    }

    /**
     * @description Execute the command
     * @param {string} commandName Command name
     * @param {Client} client Discord Client
     * @param {Message} message Discord Message
     * @param {string[]} args Command arguments
     * @example
     * // runs the ping command
     * module.runCommand('ping', client, message, args);
     * @example
     * // runs the ping command with the argument 'test'
     * module.runCommand('ping', client, message, ['test']);
     */
    public executeCommand(
        commandName: string,
        client: any,
        message: any,
        args: string[],
    ): void {
        const command =
            this.commands.get(commandName) || this.aliases.get(commandName);
        if (!command) return;
        try {
            command.execute(client, message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
}
