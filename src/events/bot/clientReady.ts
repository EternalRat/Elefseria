import { GuildHandler } from '@src/class/guild/GuildHandler.class';
import { TicketHandler } from '@src/class/ticket/TicketHandler.class';
import { User } from '@src/class/user/User.class';
import { BaseEvent, DiscordClient } from '@src/structures';
import { ActivitiesOptions, ActivityType, Events, Guild } from 'discord.js';
import { Model } from 'sequelize';

/**TicketDB
 * @description Ready event
 * @class ReadyEvent
 * @extends BaseEvent
 * @method execute - Executes the event
 */
export class ReadyEvent extends BaseEvent {
    private _guildHandler = GuildHandler.getInstance();
    private _userHandler = User.getInstance();
    private _ticketHandler = TicketHandler.getInstance();

    constructor() {
        super(Events.ClientReady, false);
    }

    /**
     * @description Executes the event
     * @param {DiscordClient} client
     */
    async execute(client: DiscordClient): Promise<void> {
        console.info(`Logged in as ${client.user?.tag}`);

        let statusIndex = 0;
        setInterval(() => {
            const status = [
                'Elefseria v0.0.1b',
                `Developped by Eternal`,
                `Elefseria Beta`,
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
                let guildDB = await this._guildHandler.getGuildById(guild.id);
                if (!guildDB) {
                    guildDB = await this._guildHandler.createGuild(
                        guild.id,
                        guild.name,
                    );
                    if (!guildDB) {
                        return;
                    }
                }
                await this.loadingUsers(guild, guildDB);
                await this.loadingTickets(guild, guildDB);
            });
        });
    }

    async loadingUsers(guild: Guild, guildDB: Model<any, any>): Promise<void> {
        const guildMembers = await guild.members.fetch();
        const idAlreadyAdded = await this._guildHandler.getGuildUsersByGuildId(
            guild.id,
        );
        for (const member of guildMembers) {
            if (member[1].user.bot) {
                continue;
            }
            if (
                idAlreadyAdded.find((user) => user.get('id') === member[1].id)
            ) {
                continue;
            }
            let userDB = await this._userHandler.getUserById(member[1].id);
            if (!userDB) {
                userDB = await this._userHandler.createUser(
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
            await this._guildHandler.createGuildUser(member[1].id, guild.id);
        }
    }

    async loadingTickets(
        guild: Guild,
        _guildDB: Model<any, any>,
    ): Promise<void> {
        console.info(`Loading tickets for guild ${guild.name}, '${guild.id}'`);
        this._ticketHandler
            .getTicketByGuildId(guild.id)
            .then(async (tickets) => {
                if (!tickets) {
                    return;
                }
                for (const ticketId of tickets) {
                    const ticket = await this._ticketHandler.getTicketById(
                        ticketId.get('id') as string,
                    );
                    if (!ticket) {
                        continue;
                    }
                    let channel;
                    try {
                        channel = await guild.channels.fetch(
                            (ticket.get('id') as string).toString(),
                        );
                    } catch (e) {
                        console.log(`Ticket ${ticket.get('id')} deleted`);
                        await this._ticketHandler.deleteTicket(
                            ticket.get('id') as string,
                        );
                        continue;
                    }
                    if (!channel || !channel.isTextBased()) {
                        continue;
                    }
                }
            });
    }
}
