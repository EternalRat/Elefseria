import { GuildTicketModel } from '@src/structures/database/models';
import { Model, ModelStatic } from 'sequelize';

export class GuildTicket {
    private static _guildTicket: ModelStatic<Model<any, any>> =
        GuildTicketModel;
    private static _instance: GuildTicket;

    private constructor() {}

    public static getInstance(): GuildTicket {
        if (GuildTicket._instance) {
            return GuildTicket._instance;
        }
        GuildTicket._instance = new GuildTicket();
        return GuildTicket._instance;
    }

    public async getGuildTicketByGuildId(
        guildId: string,
    ): Promise<Model<any, any> | null> {
        return await GuildTicket._guildTicket.findOne({ where: { guildId } });
    }

    public async getGuildTicketByCategoryId(
        categoryId: string,
    ): Promise<Model<any, any> | null> {
        return await GuildTicket._guildTicket.findOne({
            where: { categoryId },
        });
    }

    public async getGuildTicketByCategoryAndGuildId(
        categoryId: string,
        guildId: string,
    ): Promise<Model<any, any> | null> {
        return await GuildTicket._guildTicket.findOne({
            where: { categoryId, guildId },
        });
    }

    public async createGuildTicket(guildId: string) {
        const ticket = await GuildTicket._guildTicket.create({
            guildId,
        });
        return ticket;
    }

    public async updateGuildTicket(id: string, data: Record<string, any>) {
        const ticket = await GuildTicket._guildTicket.findOne({
            where: { id },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set(data);
        await ticket.save();
        return ticket;
    }

    public async deleteGuildTicket(guildId: string) {
        const ticket = await GuildTicket._guildTicket.findOne({
            where: { guildId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        await ticket.destroy();
        return ticket;
    }

    public async deleteGuildTicketByCategoryId(
        categoryId: string,
        guildId: string,
    ) {
        const ticket = await GuildTicket._guildTicket.findOne({
            where: { categoryId, guildId },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        await ticket.destroy();
        return ticket;
    }

    public async updateGuildTicketStatus(id: string, status: boolean) {
        const ticket = await GuildTicket._guildTicket.findOne({
            where: { id },
        });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set('status', status);
        await ticket.save();
        return ticket;
    }

    public async getLastPanelCreated(guildId: string) {
        const ticket = await GuildTicket._guildTicket.findOne({
            where: { guildId },
            order: [['createdAt', 'DESC']],
        });
        return ticket;
    }
}
