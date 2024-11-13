import { GuildModel } from '@src/structures/database/models';
import { Model, ModelStatic } from 'sequelize';

export class Guild {
	private static _guild: ModelStatic<Model<any, any>> = GuildModel;
	private static instance: Guild;

	private constructor() {}

	public static getInstance(): Guild {
		if (Guild.instance) {
			return Guild.instance;
		}
		Guild.instance = new Guild();
		return Guild.instance;
	}

	public async createGuild(
		id: string,
		name: string,
	): Promise<Model<any, any>> {
		return await Guild._guild.create({ id, name });
	}

	public async deleteGuild(id: string): Promise<void> {
		await Guild._guild.destroy({ where: { id } });
	}

	public async getGuildById(id: string): Promise<Model<any, any> | null> {
		return await Guild._guild.findOne({ where: { id } });
	}

	public async updateGuild(
		id: string,
		name: string,
	): Promise<Model<any, any> | null> {
		const guild = await Guild._guild.findOne({ where: { id } });
		if (guild) {
			guild.set('name', name);
			await guild.save();
		}
		return guild;
	}

	public async getGuilds(): Promise<Model<any, any>[]> {
		return await Guild._guild.findAll();
	}
}
