import { OverwriteResolvable } from 'discord.js';

import {
    GuildTicketModel,
    TicketModel,
    UserTicketModel,
} from '../../../structures/database/models/ticket/ticket.model';

export class TicketHandler {
    private _id: string = '';
    private _owner: string = '';
    private _permissions: Array<OverwriteResolvable> = [];
    private _embedMessage: string = '';
    private _users: string[] = [];

    public get id(): string {
        return this._id;
    }

    public get owner(): string {
        return this._owner;
    }

    public get permissions(): Array<OverwriteResolvable> {
        return this._permissions;
    }

    public get embedMessage(): string {
        return this._embedMessage;
    }

    public set embedMessage(embedMessage: string) {
        this._embedMessage = embedMessage;
    }

    public get users(): string[] {
        return this._users;
    }

    public static async getTicketById(
        id: string,
    ): Promise<TicketHandler | null> {
        const ticket = new TicketHandler();
        const ticketDB = await TicketModel.findOne({ where: { id: id } });
        if (!ticketDB) {
            return null;
        }
        ticket._id = ticketDB.get('id') as string;
        ticket._owner = ticketDB.get('owner') as string;
        ticket._permissions = ticketDB.get(
            'permissions',
        ) as Array<OverwriteResolvable>;
        ticket._embedMessage = ticketDB.get('embedMessage') as string;
        return ticket;
    }

    public static async createTicket(
        id: string,
        owner: string,
        permissions: object,
        embedMessage: string = '',
    ): Promise<TicketHandler | null> {
        const ticket = new TicketHandler();
        const ticketDB = await TicketModel.create({
            id: id,
            owner: owner,
            permissions: permissions,
            embedMessage: embedMessage,
        });
        if (!ticketDB) {
            return null;
        }
        ticket._id = ticketDB.get('id') as string;
        ticket._owner = ticketDB.get('owner') as string;
        ticket._permissions = ticketDB.get(
            'permissions',
        ) as Array<OverwriteResolvable>;
        ticket._embedMessage = ticketDB.get('embedMessage') as string;
        return ticket;
    }

    public async delete(): Promise<boolean> {
        await UserTicketModel.destroy({
            where: { fkTicket: this._id },
        });
        await GuildTicketModel.destroy({
            where: { fkTicket: this._id },
        });
        const ticketDB = await TicketModel.destroy({ where: { id: this._id } });
        if (!ticketDB) {
            return false;
        }
        return true;
    }

    public static async deleteTicket(id: string): Promise<boolean> {
        await UserTicketModel.destroy({
            where: { fkTicket: id },
        });
        await GuildTicketModel.destroy({
            where: { fkTicket: id },
        });
        const ticketDB = await TicketModel.destroy({ where: { id: id } });
        if (!ticketDB) {
            return false;
        }
        return true;
    }

    public static async updateTicket(
        id: string,
        owner: string,
        permissions: object,
        embedMessage: string = '',
    ): Promise<boolean> {
        const ticketDB = await TicketModel.update(
            {
                owner: owner,
                permissions: permissions,
                embedMessage: embedMessage,
            },
            { where: { id: id } },
        );
        if (!ticketDB) {
            return false;
        }
        return true;
    }

    public async save(): Promise<boolean> {
        const ticketDB = await TicketModel.update(
            {
                owner: this._owner,
                permissions: this._permissions,
                embedMessage: this._embedMessage,
            },
            { where: { id: this._id } },
        );
        if (!ticketDB) {
            return false;
        }
        return true;
    }

    public static async getTicketByOwner(
        owner: string,
    ): Promise<TicketHandler[] | null> {
        const ticket = new Array<TicketHandler>();
        const ticketDB = await TicketModel.findAll({ where: { owner: owner } });
        if (!ticketDB) {
            return null;
        }
        for (let i = 0; i < ticketDB.length; i++) {
            ticket[i] = new TicketHandler();
            ticket[i]._id = ticketDB[i].get('id') as string;
            ticket[i]._owner = ticketDB[i].get('owner') as string;
            ticket[i]._permissions = ticketDB[i].get(
                'permissions',
            ) as Array<OverwriteResolvable>;
            ticket[i]._embedMessage = ticketDB[i].get('embedMessage') as string;
        }
        return ticket;
    }

    public async addTicketToUser(user: string): Promise<boolean> {
        let ticketDB = null;
        if (!this._users.includes(user)) {
            ticketDB = await UserTicketModel.create({
                fkTicket: this._id,
                fkUser: user,
            });
        }
        if (!ticketDB && !this._users.includes(user)) {
            return false;
        }
        if (this.permissions.find((value) => value.id === user)) {
            return false;
        }
        if (this._users.includes(user)) {
            return false;
        }
        this.permissions.push({
            id: user,
            allow: ['ViewChannel'],
        });
        this._users.push(user);
        return await this.save();
    }

    public async removeTicketOfUser(user: string): Promise<boolean> {
        let ticketDB = null;
        if (this._users.includes(user)) {
            ticketDB = await UserTicketModel.destroy({
                where: { fkTicket: this._id, fkUser: user },
            });
        }
        if (!ticketDB && this._users.includes(user)) {
            return false;
        }
        this.permissions.splice(
            this.permissions.findIndex((value) => value.id === user),
            1,
        );
        this._users.splice(
            this._users.findIndex((value) => value === user),
            1,
        );
        return await this.save();
    }

    public async getUserOfTicket(): Promise<string[] | null> {
        const ticket = new Array<string>();
        const ticketDB = await UserTicketModel.findAll({
            where: { fkTicket: this._id },
        });
        if (!ticketDB) {
            return null;
        }
        for (let i = 0; i < ticketDB.length; i++) {
            ticket[i] = ticketDB[i].get('user') as string;
        }
        return ticket;
    }

    public static async getTicketOfUser(id: string): Promise<string[] | null> {
        const ticket = new Array<string>();
        const ticketDB = await UserTicketModel.findAll({
            where: { fkUser: id },
        });
        if (!ticketDB) {
            return null;
        }
        for (let i = 0; i < ticketDB.length; i++) {
            ticket[i] = ticketDB[i].get('ticket') as string;
        }
        return ticket;
    }

    public async addTicketToGuild(guild: string): Promise<boolean> {
        const ticketDB = await GuildTicketModel.create({
            fkTicket: this._id,
            fkGuild: guild,
        });
        if (!ticketDB) {
            return false;
        }
        return true;
    }

    public async removeTicketOfGuild(guild: string): Promise<boolean> {
        const ticketDB = await GuildTicketModel.destroy({
            where: { fkTicket: this._id, fkGuild: guild },
        });
        if (!ticketDB) {
            return false;
        }
        return true;
    }

    public static async getTicketOfGuild(id: string): Promise<string[] | null> {
        const ticket = new Array<string>();
        const ticketDB = await GuildTicketModel.findAll({
            where: { fkGuild: id },
        });
        if (!ticketDB) {
            return null;
        }
        for (let i = 0; i < ticketDB.length; i++) {
            ticket[i] = ticketDB[i].get('fkTicket') as string;
        }
        return ticket;
    }
}
