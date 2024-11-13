import Sequelize from 'sequelize';

import { DBConnection } from '../../../../class/database/dbConnection.db.class';
import { UserModel } from '../user/user.model';
const sequelize = DBConnection.getInstance().sequelize;

export const GuildModel = sequelize.define('guilds', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
	},
});

export const GuildUserModel = sequelize.define(
	'guildUsers',
	{
		id: {
			type: Sequelize.STRING,
			references: {
				model: UserModel,
				key: 'id',
			},
			allowNull: false,
			primaryKey: true,
		},
		fkGuild: {
			type: Sequelize.STRING,
			references: {
				model: GuildModel,
				key: 'id',
			},
			primaryKey: true,
		},
	},
	{
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	},
);
