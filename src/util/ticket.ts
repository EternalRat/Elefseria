import {
	ButtonBuilder,
	ButtonStyle,
	ChannelSelectMenuBuilder,
	ChannelType,
	RoleSelectMenuBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { Model } from 'sequelize';

export interface ComponentItem {
	style: ButtonStyle | TextInputStyle;
	label: string;
	customId: string;
}

export interface Component {
	type?: 'button' | 'role' | 'channel' | 'category';
	components: ComponentItem[];
}

export interface Page {
	name: string;
	embed: {
		title: string;
		description: string;
	};
	components?: Component[];
	modals?: {
		components: ComponentItem[];
	};
}

export const buildButtonsModal = (
	lastPanel: Model<any, any>,
	name: string,
	components: ComponentItem[],
) => {
	const btnsModal = components.reduce(
		(btns, btn) => {
			let newBtn = new ButtonBuilder()
				.setCustomId(btn.customId)
				.setLabel(btn.label)
				.setStyle(btn.style as ButtonStyle);
			btns.always.push(newBtn);
			return btns;
		},
		{
			always: [] as ButtonBuilder[],
			optional: [] as ButtonBuilder[],
		},
	);
	if (name === 'Name') {
		btnsModal.optional.push(
			new ButtonBuilder()
				.setCustomId('namePanel')
				.setLabel(
					(lastPanel?.get('name') as string).length > 0
						? 'Modify Panel Name'
						: 'Create Panel Name',
				)
				.setStyle(ButtonStyle.Secondary),
		);
	} else if (name === 'Message') {
		btnsModal.optional.push(
			new ButtonBuilder()
				.setCustomId('messagePanel')
				.setLabel(
					(lastPanel?.get('message') as string).length > 0
						? 'Modify Panel Message'
						: 'Create Panel Message',
				)
				.setStyle(ButtonStyle.Secondary),
		);
	}
	return btnsModal;
};

export const buildButtons = (components: Component[]) => {
	return components.reduce(
		(btns, btn) => {
			if (btn.type === 'button') {
				btns.button.push(
					...btn.components.map((btn) => {
						return new ButtonBuilder()
							.setCustomId(btn.customId)
							.setLabel(btn.label)
							.setStyle(btn.style as ButtonStyle);
					}),
				);
			} else if (btn.type === 'role') {
				btns.role.push(
					...btn.components.map((btn) => {
						return new RoleSelectMenuBuilder()
							.setCustomId(btn.customId)
							.setPlaceholder(btn.label)
							.setMinValues(1)
							.setMaxValues(3);
					}),
				);
			} else if (btn.type === 'channel') {
				btns.channel.push(
					...btn.components.map((btn) => {
						return new ChannelSelectMenuBuilder()
							.setCustomId(btn.customId)
							.setPlaceholder(btn.label)
							.setChannelTypes([ChannelType.GuildText]);
					}),
				);
			} else if (btn.type === 'category') {
				btns.category.push(
					...btn.components.map((btn) => {
						return new ChannelSelectMenuBuilder()
							.setCustomId(btn.customId)
							.setPlaceholder(btn.label)
							.setChannelTypes([ChannelType.GuildCategory]);
					}),
				);
			}
			return btns;
		},
		{
			button: [],
			role: [],
			channel: [],
			category: [],
		} as Record<
			'button' | 'role' | 'channel' | 'category',
			(
				| ButtonBuilder
				| RoleSelectMenuBuilder
				| TextInputBuilder
				| ChannelSelectMenuBuilder
			)[]
		>,
	);
};
