import { Model } from 'sequelize';

import { Guild } from './Guild.class';
import { GuildUser } from './GuildUser.class';

export class GuildHandler {
    private static instance: GuildHandler;
    private static _guild: Guild = Guild.getInstance();
    private static _guildUser: GuildUser = GuildUser.getInstance();

    private constructor() {}

    public static getInstance(): GuildHandler {
        if (GuildHandler.instance) {
            return GuildHandler.instance;
        }
        GuildHandler.instance = new GuildHandler();
        return GuildHandler.instance;
    }

    public async createGuild(
        id: string,
        name: string,
    ): Promise<Model<any, any>> {
        return await GuildHandler._guild.createGuild(id, name);
    }

    public async deleteGuild(id: string): Promise<void> {
        await GuildHandler._guild.deleteGuild(id);
    }

    public async getGuildById(id: string): Promise<Model<any, any> | null> {
        return await GuildHandler._guild.getGuildById(id);
    }

    public async updateGuild(
        id: string,
        name: string,
    ): Promise<Model<any, any> | null> {
        return await GuildHandler._guild.updateGuild(id, name);
    }

    public async getGuilds(): Promise<Model<any, any>[]> {
        return await GuildHandler._guild.getGuilds();
    }

    public async createGuildUser(
        id: string,
        fkUser: string,
        guildId: string,
    ): Promise<void> {
        await GuildHandler._guildUser.createGuildUser(id, fkUser, guildId);
    }

    public async deleteGuildUser(id: string): Promise<void> {
        await GuildHandler._guildUser.deleteGuildUser(id);
    }

    public async getGuildUserById(id: string): Promise<Model<any, any> | null> {
        return await GuildHandler._guildUser.getGuildUserById(id);
    }

    public async getGuildUsersByGuildId(
        guildId: string,
    ): Promise<Model<any, any>[]> {
        return await GuildHandler._guildUser.getGuildUsersByGuildId(guildId);
    }

    public async getGuildsByUserId(userId: string): Promise<Model<any, any>[]> {
        return await GuildHandler._guildUser.getGuildsByUserId(userId);
    }

    public async getGuildUserByUserIdAndGuildId(
        userId: string,
        guildId: string,
    ): Promise<Model<any, any> | undefined> {
        const guilds = await GuildHandler._guildUser.getGuildsByUserId(userId);
        return guilds.find((guild) => guild.get('guildId') === guildId);
    }
}
