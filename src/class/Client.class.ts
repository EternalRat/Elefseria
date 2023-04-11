import { Client, REST } from 'discord.js';
import { BaseModule } from '@src/structures';
import eventLoader from '@events/loader';

/**
 * @description Base class for client
 * @category BaseClass
 */

interface DiscordClientInfo {
    prefix: string;
    authorId?: string;
    modules: Map<string, BaseModule>;
}

export class DiscordClient extends Client {
    private prefix: string;
    private modules: Map<string, BaseModule> = new Map();
    private clientId: string;
    private baseRest: REST;
    private authorId?: string;

    constructor(
        config: any,
        prefix: string,
        clientId: string,
        rest: REST,
        authorId?: string,
    ) {
        super(config);
        this.prefix = prefix;
        this.clientId = clientId;
        this.baseRest = rest;
        this.authorId = authorId;
    }

    /**
     * @description Returns the modules of the client
     * @returns {Map<string, BaseModule>}
     * @example
     * // returns the modules of the client
     * client.getModules();
     */
    public getModules(): Map<string, BaseModule> {
        return this.modules;
    }

    /**
     * @description Returns the author id
     * @returns {string}
     * @example
     * // returns the author id
     * client.getAuthorId();
     * @throws {Error} If the author id is not set
     */
    public getAuthorId(): string {
        if (!this.authorId) throw new Error('The author id is not set');
        return this.authorId;
    }

    /**
     * @description Returns the client id
     * @returns {string}
     */
    public getClientId(): string {
        return this.clientId;
    }

    /**
     * @description Returns the prefix of the client
     * @returns {string}
     */
    public getBaseRest(): REST {
        return this.baseRest;
    }

    /**
     * @description Add a module to the client
     * @param {BaseModule} module
     * @example
     * // add a module to the client
     * client.addModule(module);
     * @returns {void}
     * @throws {Error} If the module already exists
     * @throws {Error} If the module is not an instance of BaseModule
     */
    public addModule(module: BaseModule): void {
        if (this.modules.has(module.getName()))
            throw new Error(`The module ${module.getName()} already exists`);
        if (!(module instanceof BaseModule))
            throw new Error(
                `The module ${module} is not an instance of BaseModule`,
            );
        this.modules.set(module.getName(), module);
    }

    /**
     * @description Add multiple modules to the client
     * @param {BaseModule[]} modules
     * @example
     * // add multiple modules to the client
     * client.addModules([module1, module2]);
     * @returns {void}
     * @throws {Error} If the module already exists
     * @throws {Error} If the module is not an instance of BaseModule
     * @throws {Error} If the modules is not an array
     * @throws {Error} If the modules is empty
     */
    public addModules(modules: BaseModule[]): void {
        if (!Array.isArray(modules))
            throw new Error(`The modules ${modules} is not an array`);
        if (modules.length == 0)
            throw new Error(`The modules ${modules} is empty`);
        modules.forEach((module: BaseModule) => {
            this.addModule(module);
        });
    }

    /**
     * @description Load the modules of the client
     * @returns {Promise<void>}
     * @example
     * // load the modules of the client
     * client.loadModules();
     */
    async loadModules(): Promise<void> {
        this.modules.forEach(async (module: BaseModule) => {
            const restResponse = (await this.baseRest.get(
                `/applications/${this.clientId}/commands`,
            )) as Array<{ name: string }>;

            let addedSlashCommands: any[] = [];
            for (let i = 0; i < restResponse.length; i++) {
                addedSlashCommands.push(restResponse[i]);
            }
            await module.loadCommands(`src/commands/${module.getName()}`);
            await module.loadInteractions(
                `src/interactions/buttons/${module.getName()}`,
            );
            await module.loadSlashCommands(
                `src/interactions/slash/${module.getName()}`,
            );
            await module.registerSlashCommands(
                this,
                addedSlashCommands,
                '1093194368531312700',
            );
        });
    }

    /**
     * @description Load the events of the client
     * @returns {Promise<void>}
     * @example
     * // load the events of the client
     * client.loadEvents();
     */
    async loadEvents(): Promise<void> {
        await eventLoader(this);
    }

    /**
     * @description Run the client
     * @param {string} token
     * @returns {Promise<void>}
     * @example
     * // run the client
     * client.run('token');
     */
    async run(token: string): Promise<void> {
        await this.login(token);
        console.info(`Bot started`);
    }

    /**
     * @description Returns the prefix of the client
     * @returns {string}
     */
    public getPrefix(): string {
        return this.prefix;
    }

    /**
     * @description Returns information about the client
     * @returns {DiscordClientInfo}
     */

    public getInfo(): DiscordClientInfo {
        return {
            prefix: this.prefix,
            modules: this.modules,
            authorId: this.authorId,
        };
    }
}
