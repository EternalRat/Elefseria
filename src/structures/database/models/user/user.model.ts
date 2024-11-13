import Sequelize from 'sequelize';

import { DBConnection } from '../../../../class/database/dbConnection.db.class';
const sequelize = DBConnection.getInstance().sequelize;

export const UserModel = sequelize.define('users', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	username: {
		type: Sequelize.STRING,
	},
});
