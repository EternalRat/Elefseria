import Sequelize from 'sequelize';

import { DBConnection } from '../../../../class/database/dbConnection.db.class';
import { GuildModel } from '../guild/guild.model';
import { UserModel } from '../user/user.model';
const sequelize = DBConnection.getInstance().sequelize;

export const PanelModel = sequelize.define('panels', {
	guildId: {
		type: Sequelize.STRING,
		references: {
			model: GuildModel,
			key: 'id',
		},
	},
	name: {
		type: Sequelize.STRING,
		defaultValue: '',
	},
	rolesId: {
		type: Sequelize.STRING,
		defaultValue: '',
	},
	categoryId: {
		type: Sequelize.STRING,
		defaultValue: '',
	},
	message: {
		type: Sequelize.STRING,
		defaultValue: '',
	},
	transcriptChannelId: {
		type: Sequelize.STRING,
		defaultValue: '',
	},
	channelId: {
		type: Sequelize.STRING,
		defaultValue: '',
	},
	status: {
		type: Sequelize.INTEGER,
		defaultValue: 2,
	},
});

export const TicketModel = sequelize.define('tickets', {
	owner: {
		type: Sequelize.STRING,
		references: {
			model: UserModel,
			key: 'id',
		},
	},
	panelId: {
		type: Sequelize.INTEGER,
		references: {
			model: PanelModel,
			key: 'id',
		},
	},
	creatorId: {
		type: Sequelize.STRING,
	},
	users: {
		type: Sequelize.STRING,
	},
	guildId: {
		type: Sequelize.STRING,
		references: {
			model: GuildModel,
			key: 'id',
		},
	},
	channelId: {
		type: Sequelize.STRING,
	},
	status: {
		type: Sequelize.INTEGER,
	},
});
