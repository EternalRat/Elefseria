import { PanelModel } from '@src/structures/database/models';
import { Model, ModelStatic } from 'sequelize';

export class Panel {
	private static _panel: ModelStatic<Model<any, any>> = PanelModel;
	private static _instance: Panel;

	private constructor() {}

	public async createPanel(guildId: string) {
		const panel = await Panel._panel.create({
			guildId,
		});
		return panel;
	}

	public static getInstance(): Panel {
		if (Panel._instance) {
			return Panel._instance;
		}
		Panel._instance = new Panel();
		return Panel._instance;
	}

	public async getPanelsByGuildId(
		guildId: string,
	): Promise<Model<any, any>[]> {
		return await Panel._panel.findAll({ where: { guildId } });
	}

	public async getPanelByGuildAndChannelId(
		guildId: string,
		channelId: string,
	): Promise<Model<any, any> | null> {
		return await Panel._panel.findOne({ where: { guildId, channelId } });
	}

	public async getLatestPanel(guildId: string) {
		const panel = await Panel._panel.findOne({
			where: { guildId },
			order: [['createdAt', 'DESC']],
		});
		return panel;
	}

	public async getPanel(id: string) {
		const panel = await Panel._panel.findOne({
			where: { id },
		});
		return panel;
	}

	public async updatePanel(id: string, data: Record<string, any>) {
		const panel = await Panel._panel.findOne({
			where: { id },
		});
		if (!panel) {
			throw new Error('Panel not found');
		}
		panel.set(data);
		await panel.save();
		return panel;
	}

	public async updatePanelStatus(id: string, status: boolean) {
		const panel = await Panel._panel.findOne({
			where: { id },
		});
		if (!panel) {
			throw new Error('Panel not found');
		}
		panel.set('status', status);
		await panel.save();
		return panel;
	}

	public async deletePanel(id: string) {
		const panel = await Panel._panel.findOne({
			where: { id },
		});
		if (!panel) {
			throw new Error('Panel not found');
		}
		await panel.destroy();
		return panel;
	}
}
