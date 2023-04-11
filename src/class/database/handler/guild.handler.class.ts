import {
    GuildModel,
    GuildUserModel,
} from '../../../structures/database/models/guild/guild.model';

export class GuildHandler {
    private _id: string = '';
    private _name: string = '';

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public static async getGuildById(id: string): Promise<GuildHandler | null> {
        const guild = new GuildHandler();
        const guildDB = await GuildModel.findOne({ where: { id: id } });
        if (!guildDB) {
            return null;
        }
        guild._id = guildDB.get('id') as string;
        guild._name = guildDB.get('name') as string;
        return guild;
    }

    public static async getGuildByName(
        name: string,
    ): Promise<GuildHandler | null> {
        const guild = new GuildHandler();
        const guildDB = await GuildModel.findOne({ where: { name: name } });
        if (!guildDB) {
            return null;
        }
        guild._id = guildDB.get('id') as string;
        guild._name = guildDB.get('name') as string;
        return guild;
    }

    public static async createGuild(
        id: string,
        name: string,
    ): Promise<GuildHandler | null> {
        const guild = new GuildHandler();
        const guildDB = await GuildModel.create({ id: id, name: name });
        if (!guildDB) {
            return null;
        }
        guild._id = guildDB.get('id') as string;
        guild._name = guildDB.get('name') as string;
        return guild;
    }

    public static async deleteGuild(id: string): Promise<boolean> {
        const guildDB = await GuildModel.destroy({ where: { id: id } });
        if (!guildDB) {
            return false;
        }
        return true;
    }

    public async addUserToGuild(id: string): Promise<boolean> {
        const guildUserDB = await GuildUserModel.create({
            fkUser: id,
            fkGuild: this._id,
        });
        if (!guildUserDB) {
            return false;
        }
        return true;
    }

    public async getUsers(): Promise<string[]> {
        const guildUsersDB = await GuildUserModel.findAll({
            where: { fkGuild: this._id },
        });
        if (!guildUsersDB) {
            return [];
        }
        const users: string[] = [];
        for (const guildUserDB of guildUsersDB) {
            users.push(guildUserDB.get('fkUser') as string);
        }
        return users;
    }

    public async removeUserFromGuild(id: string): Promise<boolean> {
        const guildUserDB = await GuildUserModel.destroy({
            where: { fkUser: id, fkGuild: this._id },
        });
        if (!guildUserDB) {
            return false;
        }
        return true;
    }

    public async isUserInGuild(id: string): Promise<boolean> {
        const guildUserDB = await GuildUserModel.findOne({
            where: { fkUser: id, fkGuild: this._id },
        });
        if (!guildUserDB) {
            return false;
        }
        return true;
    }

    public async addUsersToGuild(ids: string[]): Promise<boolean> {
        for (const id of ids) {
            const guildUserDB = await GuildUserModel.create({
                fkUser: id,
                fkGuild: this._id,
            });
            if (!guildUserDB) {
                return false;
            }
        }
        return true;
    }
}
