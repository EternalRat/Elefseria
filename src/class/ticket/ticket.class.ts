import {
    TicketMessageModel,
    TicketModel,
} from '@src/structures/database/models';
import { User } from 'discord.js';
import { Model, ModelStatic } from 'sequelize';

export class Ticket {
    private static _instance: Ticket;
    private static _ticket: ModelStatic<Model<any, any>> = TicketModel;
    private static _ticketMessage: ModelStatic<Model<any, any>> =
        TicketMessageModel;

    private constructor() {}

    public static getInstance(): Ticket {
        if (Ticket._instance) {
            return Ticket._instance;
        }
        Ticket._instance = new Ticket();
        return Ticket._instance;
    }

    public async createTicket(
        creatorId: string,
        users: User[],
        guildId: string,
        channelId: string,
    ) {
        const ticket = await Ticket._ticket.create({
            creatorId: creatorId,
            users: users.map((u) => u.id),
            guildId,
            channelId,
            status: 1,
        });
        return ticket;
    }

    public async reopenTicket(id: string): Promise<Model<any, any>> {
        const ticket = await Ticket._ticket.findOne({ where: { id } });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set('status', 1);
        await ticket.save();
        return ticket;
    }

    public async getTicketById(id: string): Promise<Model<any, any> | null> {
        return await Ticket._ticket.findOne({ where: { id } });
    }

    public async getTicketByChannelId(
        channelId: string,
    ): Promise<Model<any, any> | null> {
        return await Ticket._ticket.findOne({ where: { channelId } });
    }

    public async getTicketsByGuildId(
        guildId: string,
    ): Promise<Model<any, any>[]> {
        return await Ticket._ticket.findAll({ where: { guildId } });
    }

    public async getTicketsByUserId(
        userId: string,
    ): Promise<Model<any, any>[]> {
        return await Ticket._ticket.findAll({ where: { owner: userId } });
    }

    public async deleteTicket(id: string): Promise<void> {
        await Ticket._ticket.destroy({ where: { id } });
    }

    public async addUsersToTicket(
        channelId: string,
        guildId: string,
        users: User[],
    ): Promise<Model<any, any>> {
        const ticket = await Ticket._ticket.findOne({
            where: { channelId, guildId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set(
            'users',
            (ticket.get('users') as Array<string>).concat(
                users.map((u) => u.id),
            ),
        );
        await ticket.save();
        return ticket;
    }

    public async removeUsersFromTicket(
        channelId: string,
        guildId: string,
        users: User[],
    ): Promise<Model<any, any>> {
        const ticket = await Ticket._ticket.findOne({
            where: { channelId, guildId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set(
            'users',
            (ticket.get('users') as Array<string>).filter(
                (u) => !users.map((u) => u.id).includes(u),
            ),
        );
        await ticket.save();
        return ticket;
    }

    public async removeUsersFromTicketById(ticketId: string, users: User[]) {
        const ticket = await Ticket._ticket.findOne({
            where: { id: ticketId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set(
            'users',
            (ticket.get('users') as Array<string>).filter(
                (u) => !users.map((u) => u.id).includes(u),
            ),
        );
        await ticket.save();
        return ticket;
    }

    public async updateTicket(
        channelId: string,
        guildId: string,
        ownerId: string,
        users: User[],
    ): Promise<Model<any, any> | null> {
        const ticket = await Ticket._ticket.findOne({
            where: { channelId, guildId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set('owner', ownerId);
        ticket.set(
            'users',
            users.map((u) => u.id),
        );
        await ticket.save();
        return ticket;
    }

    public async updateTicketOwner(
        channelId: string,
        guildId: string,
        ownerId: string,
    ): Promise<Model<any, any> | null> {
        const ticket = await Ticket._ticket.findOne({
            where: { channelId, guildId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set('owner', ownerId);
        await ticket.save();
        return ticket;
    }

    public async updateTicketUsers(
        channelId: string,
        guildId: string,
        users: User[],
    ): Promise<Model<any, any> | null> {
        const ticket = await Ticket._ticket.findOne({
            where: { channelId, guildId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set(
            'users',
            users.map((u) => u.id),
        );
        await ticket.save();
        return ticket;
    }

    public async getTicketNbByGuildId(guildId: string): Promise<number> {
        return await Ticket._ticket.count({ where: { guildId } });
    }

    public async closeTicket(id: string): Promise<Model<any, any> | null> {
        const ticket = await Ticket._ticket.findOne({
            where: { id },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set('status', 0);
        await ticket.save();
        return ticket;
    }

    public async saveMessage(
        channelId: string,
        guildId: string,
        messageId: string,
        messageContent: string = '',
    ): Promise<Model<any, any> | null> {
        const ticket = await Ticket._ticket.findOne({
            where: { channelId, guildId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        await Ticket._ticketMessage.create({
            ticketId: ticket.get('id'),
            message: messageContent,
            messageId,
        });
        return ticket;
    }

    public async getMessagesByTicketId(
        ticketId: string,
    ): Promise<Model<any, any>[]> {
        return await Ticket._ticketMessage.findAll({
            where: { ticketId },
        });
    }
}
