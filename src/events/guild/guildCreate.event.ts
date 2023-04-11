import { Guild, Events } from 'discord.js';
import { BaseEvent, DiscordClient } from '@src/structures';
import { GuildHandler } from '@src/class/database/handler/guild.handler.class';
import { UserHandler } from '@src/class/database/handler/user.handler.class';

/**
 * @description GuildCreate event
 * @class GuildCreateEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class GuildCreateEvent extends BaseEvent {
    constructor() {
        super(Events.GuildCreate, false);
    }

    /**
     * @description Executes the event
     * @param {DiscordClient} client
     * @param {Guild} guild
     * @param {string[]} args
     * @returns {Promise<void>}
     */
    async execute(client: DiscordClient, guild: Guild): Promise<void> {
        console.info(
            `Joined guild: ${guild.name} with ${guild.memberCount} member=s`,
        );

        if (!guild.id || !guild.name) {
            return;
        }

        const guildDB = await GuildHandler.getGuildById(guild.id);
        if (!guildDB) {
            console.info(
                `Guild ${guild.name} not found in database, creating it`,
            );
            await GuildHandler.createGuild(guild.id, guild.name);
            console.info(`Guild ${guild.name} created`);
        }

        if (!guildDB) {
            return;
        }
        const guildMembers = await guild.members.fetch();
        const idAlreadyAdded = await guildDB.getUsers();
        for (const member of guildMembers) {
            if (member[1].user.bot) {
                continue;
            }
            const userDB = await UserHandler.getUserById(member[1].id);
            if (!userDB) {
                console.info(
                    `User ${member[1].user.tag} not found in database, creating it`,
                );
                await UserHandler.createUser(member[1].id, member[1].user.tag);
                if (!userDB) {
                    console.error(
                        `User ${member[1].user.tag} couldn't be created`,
                    );
                    continue;
                }
                console.info(`User ${member[1].user.tag} created`);
            }
            if (idAlreadyAdded.find((userId) => userId === member[1].id)) {
                continue;
            }
            await guildDB.addUserToGuild(member[1].id);
        }
    }
}
