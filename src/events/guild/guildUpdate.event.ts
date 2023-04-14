import { BaseEvent, DiscordClient } from '@src/structures';
import { Events, Guild } from 'discord.js';

/**
 * @description GuildUpdate event
 * @class GuildUpdateEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class GuildUpdateEvent extends BaseEvent {
    constructor() {
        super(Events.GuildUpdate, false);
    }

    /**
     * @description Executes the event
     * @param {DiscordClient} client
     * @param {Guild} oldGuild
     * @param {Guild} newGuild
     * @returns {Promise<void>}
     * @override
     * @memberof GuildUpdateEvent
     */
    async execute(
        client: DiscordClient,
        oldGuild: Guild,
        newGuild: Guild,
    ): Promise<void> {
        console.info(`Guild updated: ${oldGuild.name} to ${newGuild.name}`);

        // DB stuff here
    }
}
