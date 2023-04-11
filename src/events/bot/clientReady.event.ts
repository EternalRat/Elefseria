import { BaseEvent, DiscordClient } from '@src/structures';
import {
    ActivitiesOptions,
    ActivityType,
    Events,
    Guild,
    TextChannel,
} from 'discord.js';
import { GuildHandler } from '@src/class/database/handler/guild.handler.class';
import { UserHandler } from '@src/class/database/handler/user.handler.class';
import { TicketHandler } from '@src/class/database/handler/ticket.handler.class';
import { TicketManager } from '@src/class/ticket/ticketManager.class';

/**TicketDB
 * @description Ready event
 * @class ReadyEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class ReadyEvent extends BaseEvent {
    constructor() {
        super(Events.ClientReady, false);
    }

    /**
     * @description Executes the event
     * @param {DiscordClient} client
     */
    async execute(client: DiscordClient): Promise<void> {
        console.info(`Logged in as ${client.user?.tag}`);

        var statusIndex = 0;
        setInterval(() => {
            const status = [
                'NeedName v0.1',
                `Developped by Serena Satella`,
                `NeedName Beta`,
            ]; // You can change the status here
            const activity = {
                type: ActivityType.Streaming,
                name: status[statusIndex],
            } as ActivitiesOptions;
            client.user?.setPresence({
                activities: [activity],
                status: 'online',
            });
            if (statusIndex < status.length - 1) statusIndex++;
            else statusIndex = 0;
        }, 10000);
        await this.loadingGuilds(client);
    }

    async loadingGuilds(client: DiscordClient): Promise<void> {
        (await client.guilds.fetch()).forEach((clientGuild) => {
            clientGuild.fetch().then(async (guild) => {
                console.info(
                    `Working on: ${guild.name} with ${guild.memberCount} members`,
                );
                if (!parseInt(guild.id) || !guild.name) {
                    return;
                }
                let guildDB = await GuildHandler.getGuildById(guild.id);
                if (!guildDB) {
                    console.info(
                        `Guild ${guild.name} not found in database, creating it`,
                    );
                    guildDB = await GuildHandler.createGuild(
                        guild.id,
                        guild.name,
                    );
                    if (!guildDB) {
                        return console.error(
                            `Guild ${guild.name} couldn't be created`,
                        );
                    }
                    console.info(`Guild ${guild.name} created`);
                }
                await this.loadingUsers(guild, guildDB);
                await this.loadingTickets(guild, guildDB);
            });
        });
    }

    async loadingUsers(guild: Guild, guildDB: GuildHandler): Promise<void> {
        const guildMembers = await guild.members.fetch();
        const idAlreadyAdded = await guildDB.getUsers();
        for (const member of guildMembers) {
            if (member[1].user.bot) {
                continue;
            }
            if (idAlreadyAdded.find((userId) => userId === member[1].id)) {
                continue;
            }
            let userDB = await UserHandler.getUserById(member[1].id);
            if (!userDB) {
                userDB = await UserHandler.createUser(
                    member[1].id,
                    member[1].user.tag,
                );
                if (!userDB) {
                    console.error(
                        `User ${member[1].user.tag} couldn't be created`,
                    );
                    continue;
                }
            }
            await guildDB.addUserToGuild(member[1].id);
        }
    }

    async loadingTickets(guild: Guild, guildDB: GuildHandler): Promise<void> {
        console.info(`Loading tickets for guild ${guild.name}, '${guild.id}'`);
        TicketHandler.getTicketOfGuild(guildDB.id).then(async (tickets) => {
            if (!tickets) {
                return;
            }
            for (const ticketId of tickets) {
                const ticket = await TicketHandler.getTicketById(ticketId);
                if (!ticket) {
                    continue;
                }
                let channel;
                try {
                    channel = await guild.channels.fetch(ticket.id.toString());
                } catch (e) {
                    console.info(`Ticket ${ticket.id} deleted`);
                    await TicketHandler.deleteTicket(ticket.id);
                    continue;
                }
                if (!channel || !channel.isTextBased()) {
                    continue;
                }
                TicketManager.getInstance().createTicketFromDB(
                    channel as TextChannel,
                    ticket.owner,
                    ticket.permissions,
                );
                console.info(`Ticket ${ticket.id} loaded`);
            }
        });
    }
}
