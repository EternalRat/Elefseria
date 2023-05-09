import buildTranscript from '@src/util/transcript';
import {
    AttachmentBuilder,
    CategoryChannel,
    Channel,
    ChannelType,
    Guild,
    PermissionFlagsBits,
    TextChannel,
    User,
} from 'discord.js';
import { Model } from 'sequelize';

import { GuildTicket } from './GuildTicket.class';
import { Ticket } from './ticket.class';

export class TicketHandler {
    private static instance: TicketHandler;
    private static _ticket: Ticket = Ticket.getInstance();
    private static _guildTicket: GuildTicket = GuildTicket.getInstance();

    private constructor() {}

    public static getInstance(): TicketHandler {
        if (TicketHandler.instance) {
            return TicketHandler.instance;
        }
        TicketHandler.instance = new TicketHandler();
        return TicketHandler.instance;
    }

    public async createTicket(
        guild: Guild,
        creator: User,
        users: User[],
    ): Promise<{ ticket: Model<any, any>; channel: TextChannel }> {
        let channel: TextChannel | undefined;
        let nbrTickets: number | undefined;
        let ticket: Model<any, any> | undefined;
        try {
            nbrTickets = await TicketHandler._ticket.getTicketNbByGuildId(
                guild.id,
            );
            channel = await guild.channels.create({
                name: `ticket-${nbrTickets + 1}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: creator.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                        ],
                    },
                    ...users.map((u) => ({
                        id: u.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                        ],
                    })),
                ],
            });
            ticket = await TicketHandler._ticket.createTicket(
                creator.id,
                users,
                guild.id,
                channel.id,
            );
        } catch (error) {
            if (channel) {
                await channel.delete();
            }
            console.error(error);
            return Promise.reject(error);
        }
        return { ticket, channel };
    }

    public async deleteTicket(id: string): Promise<void> {
        const ticket = await TicketHandler._ticket.getTicketById(id);
        if (ticket) {
            await TicketHandler._ticket.deleteTicket(
                ticket.get('id') as string,
            );
        }
    }

    public async deleteTicketByChannel(channel: Channel): Promise<void> {
        const ticket = await TicketHandler._ticket.getTicketByChannelId(
            channel.id,
        );
        if (ticket) {
            await TicketHandler._ticket.deleteTicket(
                ticket.get('id') as string,
            );
        }
        await channel.delete();
    }

    public async closeTicket(channel: Channel): Promise<void> {
        const ticket = await TicketHandler._ticket.getTicketByChannelId(
            channel.id,
        );
        if (ticket) {
            await TicketHandler._ticket.closeTicket(ticket.get('id') as string);
        }
        await (channel as TextChannel).permissionOverwrites.set([
            {
                id: (channel as TextChannel).guild.roles.everyone,
                deny: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                ],
            },
        ]);
    }

    public async getTicketById(id: string): Promise<Model<any, any> | null> {
        return await TicketHandler._ticket.getTicketById(id);
    }

    public async isTicketOpen(channel: Channel): Promise<boolean> {
        const ticket = await TicketHandler._ticket.getTicketByChannelId(
            channel.id,
        );
        if (ticket) {
            return ticket.get('status') as boolean;
        }
        return false;
    }

    public async isTicketClosed(channel: Channel): Promise<boolean> {
        const ticket = await TicketHandler._ticket.getTicketByChannelId(
            channel.id,
        );
        if (ticket) {
            return !(ticket.get('status') as boolean);
        }
        return false;
    }

    public async isTicketClaimedByUser(
        channel: Channel,
        user: User,
    ): Promise<boolean> {
        const ticket = await TicketHandler._ticket.getTicketByChannelId(
            channel.id,
        );
        if (ticket) {
            if ((ticket.get('owner') as string).length === 0) return true;
            return ticket.get('owner') === user.id;
        }
        return false;
    }

    public async isTicketClaimed(
        channel: Channel,
        user: User,
    ): Promise<boolean> {
        const ticket = await TicketHandler._ticket.getTicketByChannelId(
            channel.id,
        );
        if (ticket) {
            return (
                (ticket.get('owner') as string).length > 0 &&
                ticket.get('owner') !== user.id
            );
        }
        return false;
    }

    public async reopenTicket(channel: Channel): Promise<void> {
        const ticket = await TicketHandler._ticket.getTicketByChannelId(
            channel.id,
        );
        if (ticket) {
            await TicketHandler._ticket.reopenTicket(
                ticket.get('id') as string,
            );
        }
        await (channel as TextChannel).permissionOverwrites.set([
            {
                id: (channel as TextChannel).guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: ticket!.get('creatorId') as string,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                ],
            },
            ...((ticket!.get('users') as string[]) || []).map((u) => ({
                id: u,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                ],
            })),
            {
                id: ticket!.get('owner') as string,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                ],
            },
        ]);
    }

    public async addUserToTicket(
        channel: Channel,
        users: User[],
    ): Promise<Model<any, any>> {
        try {
            const ticket = await TicketHandler._ticket.getTicketByChannelId(
                channel.id,
            );
            if (ticket) {
                const guild = await channel.client.guilds.fetch(
                    ticket.get('guildId') as string,
                );
                const guildChannel = await guild.channels.fetch(channel.id);
                if (
                    guildChannel &&
                    guildChannel.type === ChannelType.GuildText
                ) {
                    for (const user of users) {
                        await guildChannel.permissionOverwrites.create(user, {
                            ViewChannel: true,
                            SendMessages: true,
                        });
                    }
                    await TicketHandler._ticket.addUsersToTicket(
                        guildChannel.id,
                        ticket.get('id') as string,
                        users,
                    );
                }
                return ticket;
            }
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
        return Promise.reject('Ticket not found');
    }

    public async removeUserFromTicket(
        channel: Channel,
        users: User[],
    ): Promise<Model<any, any>> {
        try {
            const ticket = await TicketHandler._ticket.getTicketByChannelId(
                channel.id,
            );
            if (ticket) {
                const guild = await channel.client.guilds.fetch(
                    ticket.get('guildId') as string,
                );
                const guildChannel = await guild.channels.fetch(channel.id);
                if (
                    guildChannel &&
                    guildChannel.type === ChannelType.GuildText
                ) {
                    for (const user of users) {
                        await guildChannel.permissionOverwrites.delete(user);
                    }
                    await TicketHandler._ticket.removeUsersFromTicketById(
                        ticket.get('id') as string,
                        users,
                    );
                }
                return ticket;
            }
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
        return Promise.reject('Ticket not found');
    }

    public async getTicketByChannelId(
        channelId: string,
    ): Promise<Model<any, any> | null> {
        return TicketHandler._ticket.getTicketByChannelId(channelId);
    }

    public async isTicket(channelId: string): Promise<Model<any, any> | null> {
        return TicketHandler._ticket.getTicketByChannelId(channelId);
    }

    public async getTicketByGuildId(
        guildId: string,
    ): Promise<Model<any, any>[]> {
        return TicketHandler._ticket.getTicketsByGuildId(guildId);
    }

    public async getTicketByUserId(userId: string): Promise<Model<any, any>[]> {
        return TicketHandler._ticket.getTicketsByUserId(userId);
    }

    public async updateTicketOwner(
        channel: Channel,
        guild: Guild,
        newOwnerId: string,
    ): Promise<Model<any, any> | null> {
        let ticket: Model<any, any> | null = null;
        try {
            const guildChannel = await guild.channels.fetch(channel.id);
            if (guildChannel && guildChannel.type === ChannelType.GuildText) {
                ticket = await TicketHandler._ticket.getTicketByChannelId(
                    channel.id,
                );
                if (!ticket) {
                    return Promise.reject('Ticket not found');
                }
                await guildChannel.permissionOverwrites.set([
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: ticket.get('creatorId') as string,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                        ],
                    },
                    {
                        id: newOwnerId,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                        ],
                    },
                ]);
                ticket = await TicketHandler._ticket.updateTicketOwner(
                    channel.id,
                    guild.id,
                    newOwnerId,
                );
                guildChannel.setName(
                    `claim-${
                        (await guild.members.fetch(newOwnerId)).displayName
                    }`,
                );
            }
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
        return ticket;
    }

    public async updateTicketUsers(
        channel: Channel,
        guild: Guild,
        users: User[],
    ): Promise<Model<any, any> | null> {
        let ticket: Model<any, any> | null = null;
        try {
            const guildChannel = await guild.channels.fetch(channel.id);
            if (guildChannel && guildChannel.type === ChannelType.GuildText) {
                ticket = await TicketHandler._ticket.getTicketByChannelId(
                    channel.id,
                );
                if (!ticket) {
                    return Promise.reject('Ticket not found');
                }
                await guildChannel.permissionOverwrites.set([
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: ticket.get('creatorId') as string,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                        ],
                    },
                    ...users.map((u) => ({
                        id: u.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                        ],
                    })),
                ]);
                ticket = await TicketHandler._ticket.updateTicketUsers(
                    channel.id,
                    guild.id,
                    users,
                );
            }
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
        return ticket;
    }

    public async updateTicketName(
        channel: Channel,
        guild: Guild,
        name: string,
    ): Promise<Model<any, any> | null> {
        let ticket: Model<any, any> | null = null;
        try {
            const guildChannel = await guild.channels.fetch(channel.id);
            if (guildChannel && guildChannel.type === ChannelType.GuildText) {
                ticket = await TicketHandler._ticket.getTicketByChannelId(
                    channel.id,
                );
                if (!ticket) {
                    return Promise.reject('Ticket not found');
                }
                await guildChannel.setName(name);
            }
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
        return ticket;
    }

    private async getChannelMessage(channel: TextChannel, after = '') {
        let messages = await channel.messages.fetch({
            cache: true,
            after,
        });
        if (messages.size === 100) {
            const nextMessages = await this.getChannelMessage(
                channel,
                messages.last()?.id,
            );
            messages = messages.concat(nextMessages);
        }
        return messages;
    }

    public async transcriptTicket(
        channel: TextChannel,
        guild: Guild,
        user: User,
    ): Promise<Model<any, any> | null> {
        let ticket: Model<any, any> | null = null;
        try {
            const guildChannel = await guild.channels.fetch(channel.id);
            if (guildChannel && guildChannel.type === ChannelType.GuildText) {
                ticket = await TicketHandler._ticket.getTicketByChannelId(
                    channel.id,
                );
                if (!ticket) {
                    return Promise.reject('Ticket not found');
                }
                const messages = await this.getChannelMessage(channel);
                const transcript = await buildTranscript(
                    channel,
                    messages.toJSON(),
                );
                const bufferResolvable = Buffer.from(transcript);
                const attachment = new AttachmentBuilder(bufferResolvable, {
                    name: 'transcript.html',
                });

                user.send({
                    files: [attachment],
                });
            }
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
        return ticket;
    }

    public async getGuildTicketByGuildId(
        guildId: string,
    ): Promise<Model<any, any>[]> {
        return TicketHandler._guildTicket.getGuildTicketByGuildId(guildId);
    }

    public async getGuildTicketByCategoryId(
        categoryId: string,
    ): Promise<Model<any, any> | null> {
        return TicketHandler._guildTicket.getGuildTicketByCategoryId(
            categoryId,
        );
    }

    public async createGuildTicket(
        guildId: string,
    ): Promise<Model<any, any> | null> {
        return TicketHandler._guildTicket.createGuildTicket(guildId);
    }

    public async updateGuildTicket(
        id: string,
        data: Record<string, any>,
    ): Promise<Model<any, any> | null> {
        return TicketHandler._guildTicket.updateGuildTicket(id, data);
    }

    public async deleteGuildTicket(id: string): Promise<Model<any, any>> {
        return TicketHandler._guildTicket.deleteGuildTicket(id);
    }

    public async deleteGuildTicketByCategoryId(
        categoryId: string,
        guildId: string,
    ): Promise<Model<any, any>> {
        return TicketHandler._guildTicket.deleteGuildTicketByCategoryId(
            categoryId,
            guildId,
        );
    }

    public async updateGuildTicketStatus(
        guild: Guild,
        category: CategoryChannel,
        status: boolean,
    ): Promise<Model<any, any> | null> {
        const guildTicket =
            await TicketHandler._guildTicket.getGuildTicketByCategoryAndGuildId(
                category.id,
                guild.id,
            );
        if (!guildTicket) {
            return TicketHandler._guildTicket.updateGuildTicketStatus(
                guildTicket!.get('id') as string,
                status,
            );
        }
        return null;
    }

    public async getLastPanelCreated(
        guildId: string,
    ): Promise<Model<any, any> | null> {
        return TicketHandler._guildTicket.getLastPanelCreated(guildId);
    }

    public async createIfLastPanelActive(
        guildId: string,
        model: Model<any, any> | null,
    ): Promise<Model<any, any>> {
        if (!model || model.get('status') !== 2) {
            return await TicketHandler._guildTicket.createGuildTicket(guildId);
        }
        return model;
    }
}
