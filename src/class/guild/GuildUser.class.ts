import { GuildUserModel } from '@src/structures/database/models';
import { Model, ModelStatic } from 'sequelize';

export class GuildUser {
    private static _guildUser: ModelStatic<Model<any, any>> = GuildUserModel;
    private static instance: GuildUser;

    private constructor() {}

    public static getInstance(): GuildUser {
        if (GuildUser.instance) {
            return GuildUser.instance;
        }
        GuildUser.instance = new GuildUser();
        return GuildUser.instance;
    }

    public async createGuildUser(
        id: string,
        guildId: string,
    ): Promise<Model<any, any>> {
        return await GuildUser._guildUser.create({
            id,
            fkGuild: guildId,
        });
    }

    public async deleteGuildUser(id: string): Promise<void> {
        await GuildUser._guildUser.destroy({ where: { id } });
    }

    public async getGuildUserById(id: string): Promise<Model<any, any> | null> {
        return await GuildUser._guildUser.findOne({ where: { id } });
    }

    public async getGuildUsersByGuildId(
        guildId: string,
    ): Promise<Model<any, any>[]> {
        return await GuildUser._guildUser.findAll({ where: { fkGuild: guildId } });
    }

    public async getGuildsByUserId(userId: string): Promise<Model<any, any>[]> {
        return await GuildUser._guildUser.findAll({
            where: { id: userId },
        });
    }
}
